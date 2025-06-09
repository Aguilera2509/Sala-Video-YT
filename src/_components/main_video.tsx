"use client"

import styleSlug from "../app/cinema_room/[slug]/page.module.css";

import useSessionStorage from "@/useCustoms/sessionStorage";
import useMobile from "@/useCustoms/sessionMobile";

import { useEffect, useRef, useState } from "react";

import { Send_Data_VideoYT } from "@/_actionServer/control_dataVideo";
import { database } from "@/_lib/firebaseApi/firebase_credentials";
import { onValue, ref, set } from "firebase/database";

import { DetailsOptionVideo } from "@/_lib/type";

declare global {
    interface Window {
        playerInstanceGlobal: YT.Player; 
    }
};

interface YouTubeEvent {
    target: YT.Player;
    data: number;
};

const DETAILS_VIDEO:DetailsOptionVideo = {
    currentTime: 0,
    volume: 67,
    pause: "null",
    speedVideo: 1,
    count: 0,
    mute: false,
    //quality: "",
    //SphericalProperties: null
};

export default function Video_Youtube(){
    const [sessionStorageCode] = useSessionStorage("Code_Cinema_Room");
    const [sessionStorageUsername] = useSessionStorage("Username_Cinema_Room");
    const [sessionStorageHost] = useSessionStorage("Host_Cinema_Room");
    const isMobile = useMobile();

    const [detailsVideo, setDetailsVideo] = useState<DetailsOptionVideo>(DETAILS_VIDEO);

    const timerInterval = useRef<NodeJS.Timeout | null>(null);
    const timerIntervalPause = useRef<NodeJS.Timeout | null>(null);
    const playerInstance = useRef<YT.Player | null>(null);

    const [playerIsReady, setPlayerIsReady] = useState<boolean>(false);

    const [viewers, setViewers] = useState<number>(0);

    const onYouTubeIframeAPIReady = () => {
        playerInstance.current = new window.YT.Player('main_video', {
            videoId: sessionStorageCode,
            host: 'https://www.youtube-nocookie.com',
            playerVars: { 'modestbranding': 0,'enablejsapi': 1, 'origin': window.location.href },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
            }
        });

        if(isMobile){
            window.playerInstanceGlobal = playerInstance.current;
        };
    };

    function onPlayerReady(){
        setPlayerIsReady(true);
        //Function active inmediately when the video is loaded.
    };
    
    function onPlayerStateChange(event:YouTubeEvent){
        if(JSON.parse(sessionStorageHost) && event.data === window.YT.PlayerState.PLAYING){
            if(timerIntervalPause.current){
                clearInterval(timerIntervalPause.current);
            }
            timerInterval.current = setInterval(()=> {
                //console.log(event.target.getSphericalProperties());// Thinking
                setDetailsVideo((prev) => ({
                    ...prev,
                    currentTime: Math.floor(event.target.getCurrentTime()),
                    volume: isMobile ? window.volume : event.target.getVolume(),
                    pause: false,
                    mute: event.target.isMuted(),
                    speedVideo: event.target.getPlaybackRate(),
                    //quality: event.target.getPlaybackQuality(), //Option no longder support by Youtube, No matter if you get the quality, setPlaybackQuality wont have any effect
                }));
            }, 1000);
        };

        if(JSON.parse(sessionStorageHost) && event.data === window.YT.PlayerState.PAUSED){
            if(timerInterval.current){
                clearInterval(timerInterval.current);
            };

            setDetailsVideo((prev) => ({
                ...prev,
                pause: true,
            }));

            timerIntervalPause.current = setInterval(() => {
                setDetailsVideo((prev) => ({
                ...prev,
                pause: true,
                count: prev.count + 1,
            }));
            }, 4000);
        };

        if(JSON.parse(sessionStorageHost) && event.data === window.YT.PlayerState.ENDED){
            if(timerInterval.current){
                clearInterval(timerInterval.current);
            }
            if(timerIntervalPause.current){
                clearInterval(timerIntervalPause.current);
            }
        };
    };

    const gettingDetailsVideo = async () => {
        onValue(ref(database, `${sessionStorageCode}/details`), (snapshot) => {
            if(snapshot.val()){
                const data:DetailsOptionVideo = snapshot.val();
                setDetailsVideo((prev) => ({...prev, currentTime: data.currentTime, volume: data.volume, mute:data.mute, pause: data.pause, speedVideo: data.speedVideo, count: data.count }));
            }
        });
    };

    const Firebase = () => {
        //Refresh page erase users db, this both set send tha user_data again. 
        set(ref(database, `${sessionStorageCode}/users/` + sessionStorageUsername), { 
            username: sessionStorageUsername
        });
        set(ref(database, `rooms/${sessionStorageCode}`), { 
            code_video: sessionStorageCode
        });

        //When only into the room is the host, this help to avoid oversend data to firebase due to if Viewers === 1 return (useEffect Line 114);
        onValue(ref(database, `${sessionStorageCode}/users`), (snapshot) => {
            const data = snapshot.val();
            if(data === null) return setViewers(1);
            setViewers(Object.keys(data).length);
        });
    };

    useEffect(() => {
        if(playerInstance.current && isMobile && JSON.parse(sessionStorageHost) && viewers === 1){
            playerInstance.current.setVolume(detailsVideo.volume);
        };

        if(!playerIsReady || viewers === 1 || !playerInstance.current || !sessionStorageCode) return;

        if(JSON.parse(sessionStorageHost)){
            Send_Data_VideoYT({ sessionStorageCode, detailsVideo });
            if(isMobile){
                playerInstance.current.setVolume(detailsVideo.volume);
            }
            //console.log(window.YT.PlayerState);
            //console.log(player);
        }else{
            if(detailsVideo.pause){
                playerInstance.current.pauseVideo();

                if(detailsVideo.mute){
                    playerInstance.current.mute();
                }else{
                    playerInstance.current.unMute();
                };

                playerInstance.current.setVolume(detailsVideo.volume);
                playerInstance.current.setPlaybackRate(detailsVideo.speedVideo);

                if(Math.floor((playerInstance.current.getCurrentTime()-detailsVideo.currentTime)) <= -6){
                    playerInstance.current.seekTo(detailsVideo.currentTime, true);
                }else if(Math.floor((playerInstance.current.getCurrentTime()-detailsVideo.currentTime)) >= 4){
                    playerInstance.current.seekTo(detailsVideo.currentTime, true);
                };

            }else if(!detailsVideo.pause){
                playerInstance.current.playVideo();

                if(detailsVideo.mute){
                    playerInstance.current.mute();
                }else{
                    playerInstance.current.unMute();
                };
                
                playerInstance.current.setVolume(detailsVideo.volume);
                playerInstance.current.setPlaybackRate(detailsVideo.speedVideo);

                if(Math.floor((playerInstance.current.getCurrentTime()-detailsVideo.currentTime)) <= -6){
                    playerInstance.current.seekTo(detailsVideo.currentTime, true);
                }else if(Math.floor((playerInstance.current.getCurrentTime()-detailsVideo.currentTime)) >= 4){
                    playerInstance.current.seekTo(detailsVideo.currentTime, true);
                };

            }else if(detailsVideo.pause === "null"){
                playerInstance.current.stopVideo();
            };
        };
    }, [detailsVideo, playerIsReady, sessionStorageCode, viewers, playerInstance, isMobile, sessionStorageHost]);

    useEffect(() => {
        if(!sessionStorageCode) return;

        const timer = setTimeout(() => {
            if(window.YT){
                onYouTubeIframeAPIReady();
            };

            if(!JSON.parse(sessionStorageHost)){
               gettingDetailsVideo();
            };
        }, 1000);

        Firebase();

        return () => {
            clearTimeout(timer);
            if(timerInterval.current){
                clearInterval(timerInterval.current);
            }
            if(timerIntervalPause.current){
                clearInterval(timerIntervalPause.current);
            }
            if(playerInstance.current){
                playerInstance.current.destroy();
            }
            if(window.playerInstanceGlobal){
                window.playerInstanceGlobal.destroy();
            }
        };
    }, [sessionStorageCode]);

    return(
        <main className={`${styleSlug.main}`} id="main_video"></main>
    );
};