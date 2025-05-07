"use client"

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import styleSlug from "../app/cinema_room/[slug]/page.module.css";

import { useSessionStorage } from "@/useCustoms/sessionStorage";

import { Send_Message } from "@/_actionServer/formChat_Main_Videos";

import { child, get, ref } from "firebase/database";
import { database } from "@/_lib/firebaseApi/firebase_credentials";

import { Channel } from "pusher-js";

/*interface FormElements extends HTMLFormControlsCollection {
    messageInput: HTMLInputElement
};

interface MessageFormElement extends HTMLFormElement {
    readonly elements: FormElements
};*/

interface Provider {
    username: string,
    message: string,
};

let channel:Channel;

export function Field_Message(){
    const [sessionStorageCode] = useSessionStorage("Code_Cinema_Room");
    const [sessionStorageUsername] = useSessionStorage("Username_Cinema_Room");
    const formRef = useRef<HTMLInputElement | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault()

        await Send_Message( { sessionStorageCode, sessionStorageUsername, message: formRef.current!.value } );
        
        formRef.current!.value = "";
    };

    return(
        <form className="w-100" onSubmit={handleSubmit}>
            <input 
                className={`form-control ${styleSlug.inputText}`} 
                type="text"
                id="messageInput"
                ref={formRef}
                placeholder="Start typing here" 
            />
        </form>
    );
};

export function Field_Show_Message(){
    const [sessionStorageCode] = useSessionStorage("Code_Cinema_Room");
    const [messageReceive, setMessageReceive] = useState<Array<Provider>>([]);
    const messageEndRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const PusherLib = useCallback(async () => {
        const pusherClient = (await import('@/_lib/pusherAPI/client_pusher')).default;
    
        channel = pusherClient.subscribe(sessionStorageCode);
    
        channel.bind('incoming-message', ({message, username}:Provider) => {
            setMessageReceive((prev) => [...prev, {message, username}])
        });
    }, [sessionStorageCode]);

    useEffect(() => {
        if(!sessionStorageCode) return;

        get(child(ref(database), `${sessionStorageCode}/chat`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = [...Object.values(snapshot.val())] as Provider[];
                setMessageReceive((prev) => [...prev, ...data])
            } else {
                //setMessageReceive((prev) => [...prev, { message:"Not Data", username:"Admin_Bot" }])
            }
        }).catch((error:any) => {
            console.error(error);
        });

        PusherLib();

        return () => {
            channel.unsubscribe(); //Only unsubscribe but keep the connection on.
        };
    }, [sessionStorageCode, PusherLib]);

    useEffect(() => {
        scrollToBottom();
    }, [messageReceive]);

    return(
        <>
            {
                messageReceive.map((el, i:number) => (
                    <div className="card text-bg-dark mb-3 text-start" key={i}>
                        <div className="card-header text-warning">{el.username}</div>
                        <div className="card-body">
                            <p className="card-text">{el.message}</p>
                        </div>
                    </div>
                ))
            }
            <div ref={messageEndRef}></div>
        </>
    );
};