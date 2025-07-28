// src/constants/personas.ts

export interface Persona {
  id: string;
  name: string;
  age: number;
  bio: string;
  bgUrl: string;
  imageUrl: string;         // new property for persona preview image
  assistantId: string;
}

export const PERSONAS: Record<string, Persona> = {
  maya: {
    id: 'maya',
    name: 'Maya',
    age: 24,
    bio: 'A warm and curious digital companion who loves to explore travel, art, and culture.',
    bgUrl: '/bg-maya.jpg',
    imageUrl: '/preview-maya.jpg',  // preview image in /public folder
    assistantId: '5f788679-dd94-4cc5-901f-24daf04d1f48',
  },
  valentina: {
    id: 'valentina',
    name: 'Valentina',
    age: 25,
    bio: 'An energetic conversationalist passionate about music, fitness, and discovering new experiences.',
    bgUrl: '/bg-valentina.jpg',
    imageUrl: '/preview-valentina.jpg',
    assistantId: '34fb4f48-27ad-4203-8919-218b9d74d992',
  },
  fernanda: {
    id: 'fernanda',
    name: 'Fernanda',
    age: 28,
    bio: 'A thoughtful and supportive guide who enjoys in-depth discussions on books and philosophy.',
    bgUrl: '/bg-fernanda.jpg',
    imageUrl: '/preview-fernanda.jpg',
    assistantId: 'c1234567-abcd-8901-2345-abcdef678901',
  },
  // add other personas here...
};



  