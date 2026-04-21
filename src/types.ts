export interface ViralContent {
  hooks: string[];
  captions: string[];
  angles: string[];
}

export type GenerationState = 'idle' | 'loading' | 'success' | 'error';
