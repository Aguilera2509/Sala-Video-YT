"use client"

import { useEffect, useState } from "react";

import UsersIcon from "../icons_slug/users_room";

import useSessionStorage from "@/useCustoms/sessionStorage";

import { onValue, ref, remove, set } from "firebase/database";
import { database } from "@/_lib/firebaseApi/firebase_credentials";
import useMobile from "@/useCustoms/sessionMobile";

export function PlayersInRoom(){
    const [viewers, setViewers] = useState<number>(1);
    const [sessionStorageCode] = useSessionStorage("Code_Cinema_Room");
    const [sessionStorageUsername] = useSessionStorage("Username_Cinema_Room");
    const [sessionStorageHost] = useSessionStorage("Host_Cinema_Room");
    const isMobile = useMobile();

    useEffect(() => {
        if(!sessionStorageCode) return;

        const gettingViewers = () => {
            onValue(ref(database, `${sessionStorageCode}/users`), (snapshot) => {
                if(snapshot.val()){
                    const data = snapshot.val();
                    setViewers(Object.keys(data).length);
                };
            });
        };

        const UserFirebase = () => {
            const user_db = ref(database, `${sessionStorageCode}/users/${sessionStorageUsername}`);
            remove(user_db);
        };
        
        gettingViewers();

        const handleVisibilityChange = () => {
            const currentState = document.visibilityState;

            if (currentState === 'hidden') {
                const user_db = ref(database, `${sessionStorageCode}/users/${sessionStorageUsername}`);
                remove(user_db);
            } else if (currentState === 'visible') {
                set(ref(database, `${sessionStorageCode}/users/` + sessionStorageUsername), { 
                    username: sessionStorageUsername,
                    host: JSON.parse(sessionStorageHost)
                });
                set(ref(database, `rooms/${sessionStorageCode}`), { 
                    code_video: sessionStorageCode
                });
            };
        };

        if (typeof document !== 'undefined' && isMobile) {
            document.addEventListener('visibilitychange', handleVisibilityChange);
        }

        if(window && !isMobile){
            window.addEventListener("beforeunload", UserFirebase);
        }

        return() => {
            UserFirebase();
            if(window && !isMobile){
                window.removeEventListener("beforeunload", UserFirebase);
            }
            if (typeof document !== 'undefined' && isMobile) {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            }
        };
    }, [sessionStorageCode, sessionStorageUsername, isMobile, sessionStorageHost]);

    return(
        <div className="col-sm-4">
            <UsersIcon people={viewers} />
        </div>
    );
}