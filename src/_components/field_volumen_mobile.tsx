"use client"

import { FormEvent, useEffect, useRef } from "react";

import styleSlug from "../app/cinema_room/[slug]/page.module.css";
import useSessionStorage from "@/useCustoms/sessionStorage";

declare global {
    interface Window {
        volume: number;
    }
}

export default function Field_Mobile(){
    const formRef = useRef<HTMLInputElement | null>(null);
    const [sessionStorageHost] = useSessionStorage("Host_Cinema_Room");

    useEffect(() => {
        if(window){
            window.volume = 67;
        }
    }, []);


    function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        
        const volume = formRef.current!.value ? parseInt(formRef.current!.value) : 0;
        
        if(volume < 0 || volume > 100){
            window.volume = 50;
            formRef.current!.value = "50";
            return;
        };

        window.volume = volume;

        if(!JSON.parse(sessionStorageHost)){
            window.playerInstanceGlobal.setVolume(volume);
        };
    };

    return(
        <form className="w-100" onSubmit={handleSubmit}>
            <input 
                className={`form-control ${styleSlug.inputText}`} 
                type="number"
                ref={formRef}
                placeholder="Vol 0-100"
                autoComplete="off"
            />
        </form>
    );
};
