import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const apiBase = "http://localhost:8000";
const wsHost = apiBase.replace(/^https?:\/\//, "").split(":")[0];

window.Echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY || "fm1tyjgkqjeyxj3yczff",
  wsHost:
    import.meta.env.VITE_REVERB_HOST || wsHost || window.location.hostname,
  wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
  wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME || "http") === "https",
  enabledTransports: ["ws", "wss"],
  authEndpoint: `${apiBase}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  },
});
