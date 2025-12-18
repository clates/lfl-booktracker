import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Disambiguate the charset by removing, B, I, L, O, S
export const DISAMBIGUATED_CHARS = `ACDEFGHJKMNPQRUVWXYZ0123456789`;

export const disambiguate = (input: string) => {
  return input.toUpperCase().replace(/[BILLOS]/g, (char) => {
    switch (char) {
      case 'B':
        return '8';
      case 'I':
        return '1';
      case 'L':
        return '1';
      case 'O':
        return '0';
      case 'S':
        return '5';
      default:
        return char;
    }
  });
};
