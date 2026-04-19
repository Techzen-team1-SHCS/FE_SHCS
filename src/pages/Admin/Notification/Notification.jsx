import NotificationMain from './Main/NotificationMain';
import { useNotification } from './hooks/useNotification';

const Notification = () => {
  const notificationContext = useNotification();
  return <NotificationMain {...notificationContext} />;
};

export default Notification;