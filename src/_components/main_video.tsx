"use client"

import styleSlug from "../app/cinema_room/[slug]/page.module.css";

import { useSessionStorage } from "@/useCustoms/sessionStorage";

import { useEffect, useRef, useState } from "react";

import { Send_Data_VideoYT } from "@/_actionServer/control_dataVideo";
import { database } from "@/_lib/firebaseApi/firebase_credentials";
import { onValue, ref, set } from "firebase/database";

import { DetailsOptionVideo } from "@/_lib/type";

const DETAILS_VIDEO:DetailsOptionVideo = {
    currentTime: 0,
    volume: 67,
    pause: true,
    speedVideo: 1,
    //quality: "",
    //mute: false,
    //SphericalProperties: null
};

export function Video_Youtube(){
    const [sessionStorageCode] = useSessionStorage("Code_Cinema_Room");
    const [sessionStorageUsername] = useSessionStorage("Username_Cinema_Room");
    const [sessionStorageHost] = useSessionStorage("Host_Cinema_Room");

    const [detailsVideo, setDetailsVideo] = useState<DetailsOptionVideo>(DETAILS_VIDEO);

    const timerInterval = useRef<NodeJS.Timeout | null>(null);
    const timerIntervalValidatePause = useRef<NodeJS.Timeout | null>(null);
    const playerInstance = useRef<YT.Player | null>(null);

    const [playerIsReady, setPlayerIsReady] = useState<boolean>(false);

    const [users, setUsers] = useState<string[]>([]);
    //const [errorPlayer, setErrorPlayer] = useState<string>("");

    const onYouTubeIframeAPIReady = () => {
        playerInstance.current = new window.YT.Player('main_video', {
            videoId: sessionStorageCode,
            host: 'https://www.youtube-nocookie.com',
            playerVars: { 'modestbranding': 0,'enablejsapi': 1, 'origin': window.location.href },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                //'onError': onPlayerError
            }
        });
    };

    function onPlayerReady(){
        setPlayerIsReady(true);
        //Functio active inmediately when the video is loaded.
    };

    function onPlayerStateChange(event:any){
        if(JSON.parse(sessionStorageHost) && event.data === window.YT.PlayerState.PLAYING){
            if(timerIntervalValidatePause.current){
                clearInterval(timerIntervalValidatePause.current);
            };

            timerInterval.current = setInterval(()=> {
                //console.log(event.target.getSphericalProperties());// Thinking
                setDetailsVideo((prev) => ({
                    ...prev,
                    currentTime: Math.floor(event.target.getCurrentTime()),
                    volume: event.target.getVolume(),
                    pause: false,
                    //quality: event.target.getPlaybackQuality(), //Option no longder support by Youtube, No matter if you get the quality, setPlaybackQuality wont have any effect
                    speedVideo: event.target.getPlaybackRate(),
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

            timerIntervalValidatePause.current = setInterval(()=> {
                setDetailsVideo((prev) => ({
                    ...prev,
                    pause: true,
                }));
            }, 4000);
        };

        if(JSON.parse(sessionStorageHost) && event.data === window.YT.PlayerState.ENDED){
            if(timerInterval.current){
                clearInterval(timerInterval.current);
            };
            if(timerIntervalValidatePause.current){
                clearInterval(timerIntervalValidatePause.current);
            };

            /*setDetailsVideo((prev) => ({
                ...prev,
                pause: true,
            }));*/

            /*timerIntervalValidatePause.current = setInterval(()=> {
                setDetailsVideo((prev) => ({
                    ...prev,
                    pause: true,
                }));
            }, 4000);*/
        };
    };

    /*function onPlayerError(event:any){
        switch (event.data) {
            case 2:
                setErrorPlayer("Error: Invalid video ID.");
                break;
            case 5:
                setErrorPlayer("Error: HTML5 playback error.");
                break;
            case 100:
                setErrorPlayer("Error: Video not found.");
                break;
            case 101:
            case 150:
                console.error("Error: Playback not allowed by the video owner.");
                break;
            default:
                setErrorPlayer("Error: An unexpected error occurred.");
        }
    };*/

    useEffect(() => {
        if(!playerIsReady || users.length === 1 || !playerInstance.current) return;

        if(JSON.parse(sessionStorageHost)){
            Send_Data_VideoYT({ sessionStorageCode, detailsVideo });
            //console.log(window.YT.PlayerState);
            //console.log(player);
            //console.log(player.isMuted());
        }else{
            playerInstance.current.setVolume(detailsVideo.volume);
            playerInstance.current.setPlaybackRate(detailsVideo.speedVideo);

            if(Math.floor((playerInstance.current.getCurrentTime()-detailsVideo.currentTime)) <= -6){
                playerInstance.current.seekTo(detailsVideo.currentTime, true);
            }else if(Math.floor((playerInstance.current.getCurrentTime()-detailsVideo.currentTime)) >= 4){
                playerInstance.current.seekTo(detailsVideo.currentTime, true);
            }else{
                playerInstance.current.playVideo();
            };

            if(detailsVideo.pause){
                playerInstance.current.pauseVideo();
            }else{
                playerInstance.current.playVideo();
            };
        };
    }, [detailsVideo, playerIsReady, sessionStorageCode, users]);

    const gettingDetailsVideo = async () => {
        onValue(ref(database, `${sessionStorageCode}/details`), (snapshot) => {
            if(snapshot.val()){
                const data:DetailsOptionVideo = snapshot.val();
                setDetailsVideo((prev) => ({...prev, currentTime: data.currentTime, volume: data.volume, pause: data.pause, speedVideo: data.speedVideo }));
            }
        });
    };

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

        set(ref(database, `${sessionStorageCode}/users/` + sessionStorageUsername), { 
            username: sessionStorageUsername
        });
        set(ref(database, `rooms/${sessionStorageCode}`), { 
            code_video: sessionStorageCode
        });

        onValue(ref(database, `${sessionStorageCode}/users`), (snapshot) => {
            const data = snapshot.val();
            if(data === null) return setUsers([]);
            setUsers(Object.keys(data));
        });

        return () => {
            clearTimeout(timer);
            if(timerInterval.current){
                clearInterval(timerInterval.current);
            };
            if(timerIntervalValidatePause.current){
                clearInterval(timerIntervalValidatePause.current);
            };
            if(playerInstance.current){
                playerInstance.current.destroy();
            };
        };
    }, [sessionStorageCode]);

    return(
        <main className={`${styleSlug.main}`} id="main_video"></main>
    );
};