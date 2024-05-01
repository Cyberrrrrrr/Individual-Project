import { generateDays } from '@lib/utils';
import { atom } from 'jotai';

export const weekMarginAtom = atom(0);

export const channelsAtom = atom((get) => {
  return generateDays(new Date(), get(weekMarginAtom));
});
