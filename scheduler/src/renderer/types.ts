import { Program } from 'planby';

export type TaskEntries = {
  title: string;
  priority: number;
  dueDate: string;
  duration: number;
};

export type Task = Program & TaskEntries & { isComplete: boolean };
