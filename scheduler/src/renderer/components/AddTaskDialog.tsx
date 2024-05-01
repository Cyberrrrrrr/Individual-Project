import { ReactNode, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';

import { useSetAtom } from 'jotai';
import { addTaskAtom } from '@state/epg';

import DatePicker from '@components/DatePicker';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import AddIcon from '@Svg/add.svg';

const formSchema = z.object({
  title: z.string().min(1),
  priority: z.string(),
  dueDate: z.date(),
  duration: z.coerce.number().min(1).max(300),
});

export default function AddTaskDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const addTask = useSetAtom(addTaskAtom);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addTask({
      title: values.title,
      duration: values.duration,
      dueDate: values.dueDate.toLocaleDateString('en-CA'),
      priority: +values.priority,
    });
    setOpen(false);
  }

  useEffect(() => {
    if (open) form.reset();
  }, [open, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (calendarOpen && !isOpen) return setCalendarOpen(false);
        return setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
        className="max-w-max"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input className="pr-12" {...field} />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={
                            !field.value ? '!text-muted-foreground' : ''
                          }
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 (Lowest Priority)</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4 (Highest Priority)</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      open={calendarOpen}
                      setOpen={setCalendarOpen}
                    />
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Task Duration</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input className="pr-12" type="number" {...field} />
                      </FormControl>
                      <span className="text-muted-foreground top-1/2 -translate-y-1/2 right-3 absolute">
                        min
                      </span>
                    </div>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={!form.formState.isDirty}
                className="gap-1"
              >
                Add <AddIcon className="size-5 fill-foreground" />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
