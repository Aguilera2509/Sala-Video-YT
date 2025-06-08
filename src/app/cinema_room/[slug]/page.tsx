'use client'

import styleSlug from "./page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { LogoutIcon } from "@/_components/icons_slug/logout_room";
import { PlayersInRoom } from "@/_components/_slug/Users_Icon_Conection";
import { CodeRoom } from "@/_components/_slug/Code_Icon_Conection";

import Video_Youtube from "@/_components/main_video";
import { Field_Message, Field_Show_Message } from "@/_components/field_message";
import Field_Mobile  from "@/_components/field_volumen_mobile";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useSessionStorage } from "@/useCustoms/sessionStorage";
import useMobile from "@/useCustoms/sessionMobile";

export default function Cinema_Room(){
    const router = useRouter();
    const pathname = usePathname();
    const [sessionStorageCode] = useSessionStorage("Code_Cinema_Room");
    const isMobile = useMobile();

    useEffect(() => {
        if(!sessionStorageCode) return;

        const validatePathname:string = pathname.substring(13);
        
        if(sessionStorageCode !== validatePathname) return router.push("/");
    }, [sessionStorageCode, pathname, router]);

    return(
        <div className={`container-fluid`} style={{overflowY: "clip"}}>
            <div className={`row`}>

                <div className={`col-lg-9 col-md-8 ${styleSlug.paddins} ${styleSlug.heightVideo}`}>
                   <Video_Youtube />
                </div>

                <div className={`col-lg-3 col-md-4 text-white ${styleSlug.paddins} ${styleSlug.backgroundRightPanel} ${styleSlug.heightRightPanel}`} id={`${styleSlug.styleScroll}`} style={{overflowY: "auto"}}>
                    {isMobile &&
                        <div className={`col-lg-12 col-md-12 p-2 ${styleSlug.columnRightBottom}`}>
                            <Field_Mobile />
                        </div>
                    }

                    <div className={`container-fluid text-center`} style={{height: "100%"}}>
                        <div className={`row`} style={{height: "100%"}}>

                            <div className={`col-lg-12 col-md-12 p-2 ${styleSlug.columnRightTop}`} style={{overflowY: "auto"}}>
                                <div className="container-fluid">
                                    <div className="row align-items-center">
                                        <CodeRoom />
                                        <PlayersInRoom />
                                        <div className="col-sm-3">
                                            <button type="button" className={`${styleSlug.buttonExit}`} onClick={()=>{ 
                                                router.push("/"); 
                                            }}>
                                                <LogoutIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`col-lg-12 col-md-12 p-2 ${styleSlug.columnRightChat} `} id={`${styleSlug.styleScroll}`} style={{overflowY: "auto"}}>
                                <Field_Show_Message />
                            </div>

                            <div className={`col-lg-12 col-md-12 p-2 ${styleSlug.columnRightBottom}`} style={{overflowY: "auto"}}>
                                <Field_Message />
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
