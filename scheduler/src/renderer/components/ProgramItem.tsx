import { useSetAtom } from 'jotai';
import { deleteTaskAtom, updaetIsCompleteAtom } from '@state/epg';
import { isAfter } from 'date-fns';

import {
  ProgramItem,
  ProgramBox,
  ProgramContent,
  ProgramFlex,
  ProgramStack,
  ProgramTitle,
  ProgramText,
  // ProgramImage,
  useProgram,
} from 'planby';

import { Button } from '@/components/ui/button';
import { Separator } from '@components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
  ExclamationTriangleIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons';
import DeleteIcon from '@Svg/delete.svg';
import { useState } from 'react';

export default function Program({ program, ...rest }: ProgramItem) {
  const [open, setOpen] = useState(false);
  const {
    styles,
    formatTime,
    set12HoursTimeFormat,
    isLive,
    // isMinWidth
  } = useProgram({
    program,
    ...rest,
  });

  const { data } = program;
  const { id, channelUuid, title, since, till, isComplete, dueDate, priority } =
    data;

  const sinceTime = formatTime(since, set12HoursTimeFormat()).toLowerCase();
  const tillTime = formatTime(till, set12HoursTimeFormat()).toLowerCase();

  const isAfterDueDate = isAfter(channelUuid, dueDate);

  const deleteTask = useSetAtom(deleteTaskAtom);
  const updateIsComplete = useSetAtom(updaetIsCompleteAtom);

  return (
    <ProgramBox
      onClick={() => setOpen(true)}
      width={styles.width}
      style={styles.position}
    >
      <ProgramContent
        data-isafterduedate={isAfterDueDate}
        data-iscomplete={isComplete}
        className="group border-l !px-[12px] data-[iscomplete=true]:border-green-500 data-[isafterduedate=true]:border-destructive"
        width={styles.width}
        isLive={isLive}
      >
        {isComplete && !isAfterDueDate && (
          <CheckCircledIcon className="absolute right-[0.4rem] top-[0.4rem] text-green-500" />
        )}

        {isAfterDueDate && (
          <ExclamationTriangleIcon className="absolute group-hover:text-foreground right-[0.4rem] top-[0.4rem] text-destructive" />
        )}

        <ProgramFlex>
          <ProgramStack>
            <ProgramTitle className="pr-2">{title}</ProgramTitle>
            <ProgramText className="group-hover:text-foreground">
              {sinceTime} - {tillTime}
            </ProgramText>
          </ProgramStack>
        </ProgramFlex>
      </ProgramContent>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger>open</DialogTrigger> */}
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="flex h-7 justify-between items-center">
              {/* {sinceTime} - {tillTime} */}
              Due on : {new Date(dueDate).toLocaleDateString('en-CA')}
              {isComplete && (
                <span className="flex rounded-sm items-center gap-1 text-green-500 text-xs">
                  <CheckCircledIcon className="" /> Completed
                </span>
              )}
            </DialogDescription>
            <DialogDescription className="flex h-7 justify-between items-center">
              priority : {priority}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <div className="border flex-1 rounded-sm p-1 flex items-center justify-center">
              {sinceTime}
            </div>
            -
            <div className="border flex-1 rounded-sm p-1 flex items-center justify-center">
              {tillTime}
            </div>
          </div>

          {isAfterDueDate && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                This task is scheduled after the due date!
              </AlertDescription>
            </Alert>
          )}
          <Separator />
          <DialogFooter>
            <Button
              onClick={() => updateIsComplete({ id, isComplete: !isComplete })}
              variant="secondary"
            >
              Mark as {isComplete ? 'Uncomplete' : 'Complete'}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="destructive">
                  <DeleteIcon className="size-5 fill-foreground" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will delete this task permanently!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <DialogClose asChild>
                    <AlertDialogAction
                      onClick={() => setTimeout(() => deleteTask(id), 150)}
                      className="bg-destructive hover:bg-destructive/90 active:bg-destructive/95"
                    >
                      Delete
                    </AlertDialogAction>
                  </DialogClose>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProgramBox>
  );
}
