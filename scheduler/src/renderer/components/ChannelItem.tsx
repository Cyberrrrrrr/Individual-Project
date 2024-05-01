import { format, isSameDay } from 'date-fns';
import { Channel, ChannelBox } from 'planby';

interface ChannelItemProps {
  channel: Channel;
}

export default function ChannelItem({ channel }: ChannelItemProps) {
  const { position } = channel;
  const date = new Date(channel.uuid);
  const today = new Date();
  return (
    <ChannelBox
      {...position}
      data-today={isSameDay(date, today)}
      className="gap-1 flex-col relative group"
    >
      <div className="w-[2px] h-full left-0 hidden bg-primary absolute group-data-[today=true]:block" />
      {/* Overwrite styles by add eg. style={{ maxHeight: 52, maxWidth: 52,... }} */}
      {/* Or stay with default styles */}
      <p className="text-primary text-lg">{format(date, 'EE')}</p>
      {format(date, 'dd')}
    </ChannelBox>
  );
}
