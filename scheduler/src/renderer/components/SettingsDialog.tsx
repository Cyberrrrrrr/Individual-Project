import { ReactNode, useState } from 'react';
import { useAtom } from 'jotai';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { settingsAtom } from '@state/settings';

import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import TimePicker from '@components/TimePicker';
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@components/ui/dialog';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';

const formSchema = z
  .object({
    dayStart: z.string(),
    dayEnd: z.string(),
    gap: z.coerce.number().min(0).max(300),
  })
  .superRefine((formData, ctx) => {
    if (+formData.dayStart >= +formData.dayEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid time range!',
        path: ['dayEnd'], // path of error
        fatal: true,
      });
      return z.NEVER;
    }

    return z.OK;
  });

export default function SettingsDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useAtom(settingsAtom);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSettings(values);
    setOpen(false);
    form.reset(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-6">
                <FormField
                  control={form.control}
                  name="dayStart"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Day Start</FormLabel>
                      <FormControl>
                        <TimePicker
                          value={field.value}
                          setValue={field.onChange}
                        />
                      </FormControl>
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dayEnd"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Day End</FormLabel>
                      <FormControl>
                        <TimePicker
                          value={field.value}
                          setValue={field.onChange}
                        />
                      </FormControl>
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gap"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Tasks Gap</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input className="pr-12" type="number" {...field} />
                      </FormControl>
                      <span className="text-muted-foreground top-1/2 -translate-y-1/2 right-3 absolute">
                        min
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button type="submit" disabled={!form.formState.isDirty}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
