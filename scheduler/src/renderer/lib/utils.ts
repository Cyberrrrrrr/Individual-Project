import { settingsAtom } from '@state/settings';
import { Task } from '@types';
import { clsx, type ClassValue } from 'clsx';
import {
  addDays,
  addWeeks,
  isBefore,
  isMonday,
  isSameDay,
  previousMonday,
} from 'date-fns';
import { getDefaultStore } from 'jotai';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateDays(today: Date, weekMargin: number) {
  const referanceDate = addWeeks(today, weekMargin);
  const mondayDate = isMonday(referanceDate)
    ? referanceDate
    : previousMonday(referanceDate);
  const channels = [];
  for (let i = 0; i <= 6; i += 1) {
    const date = addDays(mondayDate, i);
    channels.push({
      uuid: date.toLocaleDateString('en-CA'),
    });
  }
  return channels;
}

const atomsStore = getDefaultStore();

function getMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(':');
  return +hours * 60 + (minutes ? +minutes : 0);
}

function getTimeString(minutes: number) {
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function placeTasks(tasks: Task[]) {
  const { dayStart, dayEnd, gap } = atomsStore.get(settingsAtom);
  const today = new Date().toLocaleDateString('en-CA');

  let dayTrack = today;
  let timeTrack = getMinutes(dayStart);
  const maxMinutes = getMinutes(dayEnd);

  const stay: { task: Task; i: number }[] = [];

  const toSort = tasks.filter((task, i) => {
    if (task.isComplete && !isBefore(task.channelUuid, today)) {
      stay.push({ task, i });
      return false;
    }
    return true;
  });

  const sortedTasks = toSort
    .sort((a, b) => {
      return a.priority > b.priority ? -1 : 1;
    })
    .sort((a, b) => {
      if (a.isComplete) return 0;

      const isASameDay = isSameDay(a.dueDate, today);
      const isBSameDay = isSameDay(b.dueDate, today);
      if (isASameDay && isBSameDay) return a.priority > b.priority ? -1 : 1;
      return isASameDay ? -1 : 1;
    });

  stay.forEach(({ task, i }) => {
    sortedTasks.splice(i, 0, task);
  });

  const proccessedTasks = sortedTasks.map((task, i) => {
    if (task.isComplete && isBefore(task.channelUuid, today)) {
      return task;
    }

    if (task.isComplete) {
      const taskEnd = getMinutes((task.till as string).split('T')[1]);
      timeTrack = taskEnd;
      return task;
    }

    if (i !== 0) timeTrack += gap;

    if (timeTrack + task.duration >= maxMinutes) {
      dayTrack = addDays(dayTrack, 1).toLocaleDateString('en-CA');
      timeTrack = getMinutes(dayStart);
    }

    const since = getTimeString(timeTrack);
    timeTrack += task.duration;
    const till = getTimeString(timeTrack);

    return {
      ...task,
      channelUuid: dayTrack,
      since: `2024-01-01T${since}`,
      till: `2024-01-01T${till}`,
    };
  });

  return proccessedTasks;
}
