import { usePlatform } from '../hooks/usePlatform';
import MobileRoutes from './MobileRoutes';
import DesktopRoutes from './DesktopRoutes';

export default function AppRouter() {
  const { isMobile } = usePlatform();
  return isMobile ? <MobileRoutes /> : <DesktopRoutes />;
}
