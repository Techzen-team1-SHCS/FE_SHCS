import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

export const getEcho = () => {
  if (echoInstance) return echoInstance;

  const token = localStorage.getItem('tokenAdmin') || localStorage.getItem('token');
  const appKey =
    import.meta.env.VITE_REVERB_APP_KEY ||
    import.meta.env.REACT_APP_REVERB_APP_KEY ||
    import.meta.env.VITE_PUSHER_APP_KEY;

  if (!appKey) {
    throw new Error('Missing Reverb/Pusher app key. Set VITE_REVERB_APP_KEY in FE .env.');
  }

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: appKey,
    wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
    wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
    forceTLS: String(import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    authorizer: (channel) => ({
      authorize: (socketId, callback) => {
        fetch(`${import.meta.env.VITE_API_URL.replace(/\/api$/, '')}/broadcasting/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        })
          .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
          .then(({ ok, data }) => {
            if (!ok) {
              callback(new Error(data?.message || 'Broadcast auth failed'));
              return;
            }
            callback(null, data);
          })
          .catch((error) => callback(error));
      },
    }),
  });

  return echoInstance;
};

export const leaveHousekeepingChannel = () => {
  if (echoInstance) {
    echoInstance.leave('hotel-manager.housekeeping');
  }
};
