/**
 * Central persona catalog.
 * Add or edit personas in ONE place and the rest of the app picks it up.
 */

export interface Persona {
    name: string;           // The display name in the header
    background: string;     // URL (relative to /public) or absolute path
    accentColor?: string;   // Optional highlight color for later use
  }
  
  export const PERSONAS: Record<string, Persona> = {
    maya:  { name: 'Maya',  background: '/maya-bg.jpg',  accentColor: '#00ff7f' },
    luna:  { name: 'Luna',  background: '/luna-seaside.jpg', accentColor: '#1e90ff' },
    felix: { name: 'Felix', background: '/felix-city.jpg',   accentColor: '#ffb300' },
  };
  