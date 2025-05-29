"use client"

import { FormEvent, useEffect, useRef, useState } from "react";

import styleSlug from "../app/cinema_room/[slug]/page.module.css";

import { useSessionStorage } from "@/useCustoms/sessionStorage";

import { Send_Message } from "@/_actionServer/formChat_Main_Videos";

import { onValue, ref } from "firebase/database";
import { database } from "@/_lib/firebaseApi/firebase_credentials";

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

export function Field_Message(){
    const [sessionStorageCode] = useSessionStorage("Code_Cinema_Room");
    const [sessionStorageUsername] = useSessionStorage("Username_Cinema_Room");
    const formRef = useRef<HTMLInputElement | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault()

        Send_Message( { sessionStorageCode, sessionStorageUsername, message: formRef.current!.value } );
        
        formRef.current!.value = "";
    };

    return(
        <form className="w-100" onSubmit={handleSubmit}>
            <p className={`card mb-1 border border-0 p-1`} style={{backgroundColor: "#0e0e10", color: "white"}}>{sessionStorageUsername}</p>
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

    useEffect(() => {
        if(!sessionStorageCode) return;

        const starCountRef = ref(database, `${sessionStorageCode}/chat`);
        onValue(starCountRef, (snapshot) => {
            if(snapshot.val()){
                const data = [...Object.values(snapshot.val())] as Provider[];
                setMessageReceive(data);
            }
        });

    }, [sessionStorageCode]);

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