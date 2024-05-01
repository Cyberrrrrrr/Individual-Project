import { useAtomValue, useSetAtom } from 'jotai';
import { channelsAtom, weekMarginAtom } from '@state/channels';
import { format } from 'date-fns';

import { Button } from '@components/ui/button';

import AngleRightIcon from '@Svg/angle-right.svg';
import AngleLeftIcon from '@Svg/angle-left.svg';

export default function DateNav() {
  const setWeekMargin = useSetAtom(weekMarginAtom);

  const channels = useAtomValue(channelsAtom);

  return (
    <div className="flex gap-2 items-center">
      <Button
        size="icon"
        variant="outline"
        onClick={() => setWeekMargin((prev) => prev - 1)}
      >
        <AngleLeftIcon className="size-6 fill-muted-foreground" />
      </Button>
      <p className="min-w-32 text-center">
        {format(channels[0].uuid, 'dd')} -{' '}
        {format(channels[6].uuid, 'dd MMM yyyy')}
      </p>

      <Button
        size="icon"
        variant="outline"
        onClick={() => setWeekMargin((prev) => prev + 1)}
      >
        <AngleRightIcon className="size-6 fill-muted-foreground" />
      </Button>
      <Button variant="outline" onClick={() => setWeekMargin(0)}>
        This Week
      </Button>
    </div>
  );
}
