import Header from '@components/Header';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';

import DateNav from '@components/DateNav';
import TimeTable from '@components/TimeTable';
import AddTaskDialog from '@components/AddTaskDialog';

export default function Dashboard() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <Header />
      <Separator />
      <div className="flex items-center justify-between">
        <DateNav />
        <AddTaskDialog>
          <Button>Add Task</Button>
        </AddTaskDialog>
      </div>
      <TimeTable />
    </main>
  );
}
