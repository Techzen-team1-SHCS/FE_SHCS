import { useNotification } from './hooks/useNotification';
import NotificationMain from './main/NotificationMain';

const Notification = () => {
  const notificationContext = useNotification();
  return <NotificationMain {...notificationContext} />;
};

export default Notification;