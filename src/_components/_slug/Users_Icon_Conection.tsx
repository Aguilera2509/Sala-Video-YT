"use client"

import { useCallback, useEffect, useState } from "react";

import { UsersIcon } from "../icons_slug/users_room";

import { useSessionStorage } from "@/useCustoms/sessionStorage";
import { ref, remove } from "firebase/database";
import { database } from "@/_lib/firebaseApi/firebase_credentials";

import { Channel } from "pusher-js";

interface SubscriptionCountData {
    subscription_count: number;
};

let channel:Channel;

export function PlayersInRoom(){
    const [viewers, setViewers] = useState<number>(1);
    const [sessionStorageCode] = useSessionStorage("Code_Cinema_Room");
    const [sessionStorageUsername] = useSessionStorage("Username_Cinema_Room");

    const PusherLib = async () => {
        const pusherClient = (await import('@/_lib/pusherAPI/client_pusher')).default;
    
        channel = pusherClient.subscribe(sessionStorageCode);
    
        channel.bind("pusher:subscription_count", function(data:SubscriptionCountData){
            setViewers(data.subscription_count);
        });
    };
    
    const UserFirebase = useCallback(() => {
        const user_db = ref(database, `${sessionStorageCode}/users/${sessionStorageUsername}`);
        remove(user_db);
    }, [sessionStorageCode, sessionStorageUsername]);

    useEffect(() => {
        if(!sessionStorageCode) return;
        
        PusherLib();

        return() => {
            UserFirebase();
        };
    }, [sessionStorageCode, UserFirebase]);

    useEffect(() => {
        if(!sessionStorageCode) return;

        function beforeunload(){
            UserFirebase();
        };

        window.addEventListener("beforeunload", beforeunload);

        return () => {
            window.removeEventListener("beforeunload", beforeunload);
        };
    }, [sessionStorageCode, UserFirebase]);

    return(
        <div className="col-sm-4">
            <UsersIcon people={viewers} />
        </div>
    );
}