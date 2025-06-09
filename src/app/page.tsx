"use client"

import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./page.module.css";

import Image from "next/image";
import image_room from "../../public/First_Image.webp";

import { Form_CinemaRoom } from "@/_components/app_page/form";
import { useEffect, useState } from "react";
import { onValue, ref, remove } from "firebase/database";
import { database } from "@/_lib/firebaseApi/firebase_credentials";

export default function Home() {
  const [rooms, setRooms] = useState<string[]>([]);

  const RoomsFirebase = (code:string) => {
    const room_db = ref(database, `rooms/${code}`);
    remove(room_db);
  };

  const DetailsFirebase = (code:string) => {
    const detailsVideo_db = ref(database, `${code}/details`);
    remove(detailsVideo_db);
  };

  const ChatFirebase = (code:string) => {
    const chat_db = ref(database, `${code}/chat`);
    remove(chat_db);
  };

  useEffect(() => {
    onValue(ref(database, `rooms`), (snapshot) => {
      const data = snapshot.val();
      if(data === null) return setRooms([]);;
      setRooms(Object.keys(data));
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(()=> {
      rooms.map(el => {
        onValue(ref(database, `${el}/users`), (snapshot) => {
          const data = snapshot.val();
          if(data === null){
            RoomsFirebase(el);
            ChatFirebase(el);
            DetailsFirebase(el);
          };
        });
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [rooms]);

  return (
    <main>
      
      <div className={`${styles.divTop}`}>
        <div className="container text-start" style={{padding: "3rem 2.2rem"}}>
          <div className="row align-items-start text-white">
            <h1 style={{paddingBottom: "1.5rem"}}>Enjoy spending time with your friends while all of 
              you are watching a youtube&apos;s video together</h1>

            <p className="h5">You have 2 options: Create a room or Join to a room</p>
            <p className="h5">If you decide to create the room, only enter the video&apos;s url and share the code</p>
            <p className="h5">If you decide to join the room, only enter the room&apos;s code shared by your friend</p>
            <p className="h5">Into the room you have a chat that contains the code, viewers and exit option upon it</p>
            <p className="h5">And only who create the room can manage the video to all of you while its runnig/playing or pause</p>
            <p className="h5">When the video get ended everyone is free to handle its own video&apos;s options while the HOST not handling its video</p>
            <p style={{paddingBottom: "3.2rem"}} className="h5">If you are using a mobile to join in you&apos;ll get an input to manage the global volume, the volume of video and your mobile will be splitted</p>
          </div>
        </div>
      </div>

      <div className={`${styles.divBottom} w-100`}>

        <div className="container text-center" style={{padding: "3rem 2.2rem"}}>
          <div className="row align-items-start text-white">

            <div className="col-md-12">
              <Image src={image_room} priority={true} alt="How Looks the cinema room" className="h-100 rounded border border-2" style={{width: "100%"}} />
            </div>

            <div className="col-md-12 pt-5">
              <Form_CinemaRoom />  
            </div>

          </div>
        </div>

      </div>

    </main>
  );
}
