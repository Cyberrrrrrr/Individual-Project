import { atom, getDefaultStore } from 'jotai';
import { Task, TaskEntries } from '@types';
import { placeTasks } from '@lib/utils';
import { atomWithLocalStorage } from '@state';
import { settingsAtom } from './settings';

const atomsStore = getDefaultStore();

export const epgListAtom = atomWithLocalStorage<Task[]>(
  'epgList',
  [],
  placeTasks,
);

export const addTaskAtom = atom(null, (get, set, task: TaskEntries) => {
  set(epgListAtom, (prev) =>
    placeTasks([
      ...prev,
      {
        id: crypto.randomUUID(),
        channelUuid: new Date(task.dueDate).toLocaleDateString('en-CA'),
        since: '2024-01-01T09:50:00',
        till: '2024-01-01T10:55:00',
        description: '',
        image: '',
        isComplete: false,
        ...task,
      },
    ]),
  );
});

export const deleteTaskAtom = atom(null, (_, set, id: string) => {
  set(epgListAtom, (prev) => placeTasks(prev.filter((task) => task.id !== id)));
});

export const updaetIsCompleteAtom = atom(
  null,
  (_, set, { id, isComplete }: { id: string; isComplete: boolean }) => {
    set(epgListAtom, (prev) => {
      const objIndex = prev.findIndex((obj) => obj.id === id);
      if (objIndex === -1) return prev;
      const updatedObj = { ...prev[objIndex], isComplete };
      return placeTasks([
        ...prev.slice(0, objIndex),
        updatedObj,
        ...prev.slice(objIndex + 1),
      ]);
    });
  },
);

atomsStore.sub(settingsAtom, () => {
  atomsStore.set(epgListAtom, placeTasks(atomsStore.get(epgListAtom)));
});
