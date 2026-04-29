import Pusher from "pusher-js";

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
