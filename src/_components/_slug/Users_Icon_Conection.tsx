"use client"

import { useCallback, useEffect, useState } from "react";

import { UsersIcon } from "../icons_slug/users_room";

import useSessionStorage from "@/useCustoms/sessionStorage";

import { onValue, ref, remove } from "firebase/database";
import { database } from "@/_lib/firebaseApi/firebase_credentials";

export function PlayersInRoom(){
    const [viewers, setViewers] = useState<number>(1);
    const [sessionStorageCode] = useSessionStorage("Code_Cinema_Room");
    const [sessionStorageUsername] = useSessionStorage("Username_Cinema_Room");

    const gettingViewers = async () => {
        onValue(ref(database, `${sessionStorageCode}/users`), (snapshot) => {
            if(snapshot.val()){
                const data = snapshot.val();
                setViewers(Object.keys(data).length);
            };
        });
    };
    
    const UserFirebase = useCallback(() => {
        const user_db = ref(database, `${sessionStorageCode}/users/${sessionStorageUsername}`);
        remove(user_db);
    }, [sessionStorageCode, sessionStorageUsername]);

    useEffect(() => {
        if(!sessionStorageCode) return;
        
        gettingViewers();

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