"use client"

import { useEffect, useState } from "react"

function useSessionStorage(key:string){
    const [value, setValue] = useState<string>("");

    useEffect(() => {
        if(window){
            const storedValue = sessionStorage.getItem(key);
            //console.log('storedValue:', storedValue);
            if (storedValue) {
                setValue(JSON.parse(storedValue));
            }
        };
    }, [key]);

    const setSessionValue = (newValue:string):void => {
        setValue(newValue);
        sessionStorage.setItem(key, JSON.stringify(newValue));
    };

    return [value, setSessionValue] as const;
};

export default useSessionStorage;