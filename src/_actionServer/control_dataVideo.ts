"use server"

import { pusherServer } from "@/_lib/pusherAPI/server_pusher"

export async function Send_Data_VideoYT({ sessionStorageCode, detailsVideo }:
    { sessionStorageCode:string, detailsVideo:{ currentTime:number, volume:number, pause:boolean, speedVideo:number } }
) {
    if(!sessionStorageCode) return;

    pusherServer.trigger(sessionStorageCode, 'incoming-data-video-yt', {
        detailsVideo
    });
};