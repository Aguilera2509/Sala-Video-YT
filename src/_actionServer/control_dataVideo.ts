"use server"

import { database } from "@/_lib/firebaseApi/firebase_credentials";
import { DetailsOptionVideo } from "@/_lib/type";
import { ref, set } from "firebase/database";

function data_video_fb(sessionStorageCode:string, detailsVideo:DetailsOptionVideo){
    set(ref(database, `${sessionStorageCode}/details`), {
        currentTime: detailsVideo.currentTime,
        volume: detailsVideo.volume,
        mute: detailsVideo.mute,
        pause: detailsVideo.pause,
        speedVideo: detailsVideo.speedVideo,
        count: detailsVideo.count
    });
};

export async function Send_Data_VideoYT({ sessionStorageCode, detailsVideo }:
    { sessionStorageCode:string, detailsVideo:DetailsOptionVideo }
) {
    if(!sessionStorageCode) return;

    data_video_fb(sessionStorageCode, detailsVideo);
};