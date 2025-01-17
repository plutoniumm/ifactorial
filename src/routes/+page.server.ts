import { readdirSync } from 'fs';

const files = readdirSync('data')
  .filter((f) => f.match(/20\d{2}/))
  .sort()

export const load = () => ({ files });