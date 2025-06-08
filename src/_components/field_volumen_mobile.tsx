"use client"

import { FormEvent, useRef } from "react";

import styleSlug from "../app/cinema_room/[slug]/page.module.css";
import { useSessionStorage } from "@/useCustoms/sessionStorage";

declare global {
    var volume:number
};

global.volume = 67;

export default function Field_Mobile(){
    const formRef = useRef<HTMLInputElement | null>(null);
    const [sessionStorageHost] = useSessionStorage("Host_Cinema_Room");

    function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        
        const volume = formRef.current!.value ? parseInt(formRef.current!.value) : 0;
        
        if(volume < 0 || volume > 100){
            global.volume = 50;
            formRef.current!.value = "50";
            return;
        };

       global.volume = volume;

        if(!JSON.parse(sessionStorageHost)){
            global.playerInstanceGlogal!.setVolume(volume);
        };
    };

    return(
        <form className="w-100" onSubmit={handleSubmit}>
            <input 
                className={`form-control ${styleSlug.inputText}`} 
                type="number"
                ref={formRef}
                placeholder="0-100"
                autoComplete="off"
            />
        </form>
    );
};
