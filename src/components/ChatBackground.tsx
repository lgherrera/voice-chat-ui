import React from 'react';
import { Box } from '@mui/material';

interface ChatBackgroundProps {
  /** Path or URL to the background image. */
  image: string;
  /** Opacity of the image layer (0 – 1).  Default = 0.8 */
  imageOpacity?: number;
  /** Opacity of the black overlay (0 – 1). Default = 0.30 */
  overlayOpacity?: number;
}

/**
 * Fills the viewport with a background photo plus a dark overlay.
 * Pointer events are disabled so it never intercepts taps/clicks.
 */
export const ChatBackground: React.FC<ChatBackgroundProps> = ({
  image,
  imageOpacity = 0.8,
  overlayOpacity = 0.3,
}) => (
  <>
    {/* Photo layer */}
    <Box
      sx={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: imageOpacity,
        zIndex: -2,
      }}
    />

    {/* Dark overlay */}
    <Box
      sx={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        bgcolor: `rgba(0,0,0,${overlayOpacity})`,
        zIndex: -1,
      }}
    />
  </>
);
