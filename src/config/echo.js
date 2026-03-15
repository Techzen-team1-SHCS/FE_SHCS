import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: 'fm1tyjgkqjeyxj3yczff',
    wsHost: 'be-shcs.onrender.com',
    wsPort: 443,
    wssPort: 443,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    },
    authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
});
