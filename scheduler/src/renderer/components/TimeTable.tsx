import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { channelsAtom } from '@state/channels';
import { settingsAtom } from '@state/settings';
import { epgListAtom } from '@state/epg';

import {
  Epg,
  Layout,
  Channel,
  //  Program,
  useEpg,
} from 'planby';
import Timeline from '@components/Timeline';
import ChannelItem from '@components/ChannelItem';
import ProgramItem from '@components/ProgramItem';

import { theme } from '@helpers/theme';

export default function TimeTable() {
  const settings = useAtomValue(settingsAtom);
  const channels = useAtomValue(channelsAtom);
  const epg = useAtomValue(epgListAtom);
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  const channelsData = useMemo(() => channels, [channels]);
  const epgData = useMemo(() => epg, [epg]);

  const { getEpgProps, getLayoutProps } = useEpg({
    channels: channelsData as Channel[],
    epg: epgData,
    dayWidth: (+settings.dayEnd - +settings.dayStart) * 200,
    sidebarWidth: 100,
    itemHeight: 80,
    isSidebar: true,
    isTimeline: true,
    isLine: true,
    startDate: `2024-01-01T${settings.dayStart.padStart(2, '0')}:00:00`,
    endDate: `2024-01-01T${settings.dayEnd.padStart(2, '0')}:00:00`,
    // endDate: `2022-10-18T24:00:00`,
    isBaseTimeFormat: true,
    theme,
  });

  return (
    <div className="w-full h-[calc(100%-7rem)]">
      <Epg {...getEpgProps()}>
        <Layout
          {...getLayoutProps()}
          renderTimeline={(props) => <Timeline {...props} />}
          renderProgram={({ program, ...rest }) => (
            <ProgramItem key={program.data.id} program={program} {...rest} />
          )}
          renderChannel={({ channel }) => (
            <ChannelItem key={channel.uuid} channel={channel} />
          )}
        />
      </Epg>
    </div>
  );
}
