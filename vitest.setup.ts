import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Esto limpia el DOM después de cada test individual
afterEach(() => {
  cleanup();
});