"use client"

import { useEffect, useState } from "react"

function useMobile(){
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        if(window){
            const info = navigator.userAgent;
    
            const isMobileFunction = {
                android: ()=> info.match(/android/i),
                ios: ()=> info.match(/iphone|ipad|ipod/i),
                //windows: ()=> info.match(/windows phone/i),
                any: function(){
                    return this.android() || this.ios(); //|| this.windows();
                }
            };
            const innerWidth = window.innerWidth;
            if(isMobileFunction.any() && innerWidth <= 1024){
                setIsMobile(true);
            }
        };
    }, []);

    return isMobile;
};

export default useMobile;