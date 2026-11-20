import { Language } from '../types';

export const triText = (
  language: Language,
  english: string,
  marathi: string,
  hindi: string
) => {
  if (language === 'mr') return marathi || english;
  if (language === 'hi') return hindi || english;
  return english;
};
