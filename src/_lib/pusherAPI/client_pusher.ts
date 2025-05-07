import Pusher from "pusher-js";

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_APP_KEY as string, {
    cluster: process.env.NEXT_PUBLIC_APP_CLUSTER as string
});

export default pusherClient;