import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: process.env.APP_ID as string,
  key: process.env.APP_KEY as string,
  secret: process.env.APP_SECRET as string,
  cluster: process.env.APP_CLUSTER as string,
  useTLS: true
});