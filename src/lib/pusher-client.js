import PusherClient from "pusher-js";

// Client-side Pusher (for Frontend)
// We use a singleton pattern to ensure only one connection is made
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY, 
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  }
);
