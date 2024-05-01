import { atomWithLocalStorage } from '@state';

export const settingsAtom = atomWithLocalStorage<{
  gap: number;
  dayStart: string;
  dayEnd: string;
}>('settings', {
  gap: 20,
  dayStart: '09',
  dayEnd: '17',
});

export default settingsAtom;
