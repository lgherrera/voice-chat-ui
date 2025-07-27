// src/types/index.ts
export type Persona = {
    id: string;
    name: string;
    age: number;
    imageUrl: string;
    bio: string | null;
    assistantId: string; // Add this
    bgUrl: string; // Add this
  };