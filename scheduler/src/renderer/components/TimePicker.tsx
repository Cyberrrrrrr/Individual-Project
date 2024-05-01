import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';

import AngleUpIcon from '@Svg/angle-up.svg';
import AngleDownIcon from '@Svg/angle-down.svg';

type TimePickerProps = {
  value: string;
  setValue: (value: string) => void;
};

/**
 **
 * Basic time picker input
 */
export default function TimePicker({ value, setValue }: TimePickerProps) {
  return (
    <div className="flex overflow-hidden border w-max rounded-md border-input">
      <Input
        readOnly
        value={`${value.padStart(2, '0')}:00`}
        className="h-16 w-24 border-none text-center text-2xl focus-visible:ring-0"
      />
      <div className="flex flex-col border-l">
        <Button
          disabled={+value === 24}
          onClick={() => setValue((+value + 1).toString())}
          type="button"
          variant="outline"
          size="icon"
          className="border-none rounded-none"
        >
          <AngleUpIcon className="size-5  fill-muted-foreground" />
        </Button>
        <Button
          disabled={+value === 1}
          onClick={() => setValue((+value - 1).toString())}
          type="button"
          variant="outline"
          size="icon"
          className="border-none rounded-none"
        >
          <AngleDownIcon className="size-5 fill-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
