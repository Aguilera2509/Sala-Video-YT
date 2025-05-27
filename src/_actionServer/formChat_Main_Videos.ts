"use server"

import { database } from "@/_lib/firebaseApi/firebase_credentials";
import { ref, set } from "firebase/database";

function chat_room_db(username:string, message:string, code_video:string) {
    const id = Date.now();
    set(ref(database, `${code_video}/chat/` + id), { 
        username,
        message
    });
};

export async function Send_Message({ sessionStorageCode, sessionStorageUsername, message }:
    { sessionStorageCode:string, sessionStorageUsername:string, message:string }
) {
    if(!sessionStorageCode) return;

    chat_room_db(sessionStorageUsername, message, sessionStorageCode);
};