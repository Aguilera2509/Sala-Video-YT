"use server"

import { database } from "@/_lib/firebaseApi/firebase_credentials";
import { ref, set } from "firebase/database";

function chat_room_db(username:string, message:string, host: string, code_video:string) {
    const id = Date.now();
    set(ref(database, `${code_video}/chat/` + id), { 
        username,
        message,
        host
    });
};

export async function Send_Message({ sessionStorageCode, sessionStorageUsername, sessionStorageHost, message }:
    { sessionStorageCode:string, sessionStorageUsername:string, sessionStorageHost:string, message:string }
) {
    if(!sessionStorageCode) return;

    chat_room_db(sessionStorageUsername, message, sessionStorageHost, sessionStorageCode);
};