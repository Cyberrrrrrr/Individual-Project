import SettingsDialog from '@components/SettingsDialog';
import { Button } from '@components/ui/button';

import LogoImg from '@Img/logo.png';
import SettingsIcon from '@Svg/settings.svg';

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <img src={LogoImg} alt="logo" className="size-6" />
        <h1>Scheduler</h1>
      </div>
      <SettingsDialog>
        <Button variant="secondary" size="icon">
          <SettingsIcon className="size-5 fill-white" />
        </Button>
      </SettingsDialog>
    </header>
  );
}
