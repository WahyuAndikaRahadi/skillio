import Pusher from "pusher-js";

// Client-side Pusher (for Frontend)
// We ensure it only initializes on the client to avoid SSR errors
let pusherInstance = null;

if (typeof window !== "undefined") {
  pusherInstance = new Pusher(
    process.env.NEXT_PUBLIC_PUSHER_KEY, 
    {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: "/api/pusher/auth",
    }
  );
}

export const pusherClient = pusherInstance;
