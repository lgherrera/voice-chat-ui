import React, { useEffect, useRef, useState } from 'react';
import {
  Slide,
  Box,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import Picker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';

interface Props {
  transcripts: string[];
  onBack: () => void;
  onSend?: (text: string) => void;
}

const persona = 'Maya';
const background = '/maya-bg.jpg';

const isUser = (line: string) => line.startsWith('user:');

export const TranscriptPage: React.FC<Props> = ({
  transcripts,
  onBack,
  onSend,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  const send = () => {
    if (!draft.trim()) return;
    onSend?.(draft);
    setDraft('');
    setShowEmojiPicker(false);
  };

  const addEmoji = (emoji: any) => {
    setDraft((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <Slide direction="left" in>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          maxWidth: 430,
          mx: 'auto',
          height: '100dvh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
        }}
      >
        {/* Background layers */}
        <Box
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8,
            zIndex: -2,
          }}
        />
        <Box
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.30)',
            zIndex: -1,
          }}
        />

        {/* Header */}
        <Box
          sx={{
            position: 'relative',
            p: 1.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
          }}
        >
          <IconButton
            onClick={onBack}
            sx={{
              pointerEvents: 'auto',
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.35)',
              color: 'white',
              width: 36,
              height: 36,
              zIndex: 10,
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <IconButton
            onClick={() => console.log('call')}
            aria-label="Phone"
            sx={{
              pointerEvents: 'auto',
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.35)',
              color: 'white',
              width: 36,
              height: 36,
              zIndex: 10,
            }}
          >
            <PhoneIcon />
          </IconButton>

          <Typography variant="h5" fontWeight={600}>
            {persona}
          </Typography>
          <Typography variant="caption" sx={{ color: 'springgreen' }}>
            Online
          </Typography>
        </Box>

        {/* Chat area */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            px: 2,
            pb: '96px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {transcripts.map((line, i) => {
            const user = isUser(line);
            const text = line.replace(/^(user|assistant):\s*/, '');

            return (
              <Box
                key={i}
                sx={{
                  maxWidth: '80%',
                  alignSelf: user ? 'flex-end' : 'flex-start',
                  bgcolor: user
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(255,230,221,0.9)',
                  color: user ? 'white' : 'black',
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  borderBottomRightRadius: user ? 0 : 2,
                  borderBottomLeftRadius: user ? 2 : 0,
                  backdropFilter: 'blur(2px)',
                }}
              >
                <Typography variant="body2">{text}</Typography>
              </Box>
            );
          })}
          <div ref={bottomRef} />
        </Box>

        {/* Emoji picker popup */}
        {showEmojiPicker && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 16,
              zIndex: 20,
            }}
          >
            <Picker data={emojiData} onEmojiSelect={addEmoji} theme="dark" />
          </Box>
        )}

        {/* Message composer */}
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 'env(safe-area-inset-bottom)',
            display: 'flex',
            gap: 1,
            p: 1.5,
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(0,0,0,0.4)',
            zIndex: 10,
            maxWidth: 430,
            mx: 'auto',
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            variant="filled"
            size="small"
            placeholder="Message"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            sx={{
              input: { color: 'white' },
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: 2,
            }}
          />

          <IconButton
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            aria-label="Emoji"
            sx={{
              bgcolor: 'black',
              color: 'white',
              '&:hover': { bgcolor: '#333' },
              width: 48,
              height: 48,
            }}
          >
            😊
          </IconButton>

          <IconButton
            onClick={send}
            aria-label="Send"
            sx={{
              bgcolor: 'black',
              color: 'white',
              '&:hover': { bgcolor: '#333' },
              width: 48,
              height: 48,
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Slide>
  );
};














