"use client"

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import useSessionStorage from "@/useCustoms/sessionStorage";

import { serverActionCreateRoom, serverActionJoinRoom } from "@/_actionServer/formAction";
import { database } from "@/_lib/firebaseApi/firebase_credentials";
import { onValue, ref } from "firebase/database";

import { DataCreateState, DataJoinState } from "@/_lib/type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function Form_CinemaRoom(){
    const [dataJoin, setDataJoin] = useState<DataJoinState>({
        form: {
            username: "",
            code: "",
        },
        error: {
            statusCode: 0,
            statusMessage: ""
        },
        success:{
            code_video: "",
            username_video: "",
            host: "false"
        }
    });
    const [dataCreate, setDataCreate] = useState<DataCreateState>({
        form: {
            username: "",
            url_yt: ""
        },
        error: {
            statusCode: 0,
            statusMessage: ""
        },
        success:{
            code_video: "",
            username_video: "",
            host: "true"
        }
    });
    const [loading, setLoading] = useState<boolean>(false);

    const [usernames, setUsernames] = useState<string[]>([]);
    const [rooms, setRooms] = useState<string[]>([]);

    const [sessionStorageCode, setSessionStorageCode] = useSessionStorage("Code_Cinema_Room");
    const [sessionStorageUsername, setSessionStorageUsername] = useSessionStorage("Username_Cinema_Room");
    const [, setSessionStorageHost] = useSessionStorage("Host_Cinema_Room");
    const router:AppRouterInstance = useRouter();

    async function handleSubmitToCreate(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        setLoading(true);

        const code_video:string = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=([a-zA-Z0-9_-]+){11})(?:&.*)?$/.test(dataCreate.form.url_yt.trim().replaceAll(" ", "")) ? 
            dataCreate.form.url_yt.trim().replaceAll(" ", "").substring(32, 43) :  /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/([a-zA-Z0-9_-]+){11}\?si=([a-zA-Z0-9_-]+))(?:&.*)?$/.test(dataCreate.form.url_yt.trim().replaceAll(" ", "")) ? dataCreate.form.url_yt.trim().replaceAll(" ", "").substring(17, 28) : ""
        const index_room:number = rooms.findIndex(el => el === code_video);

        try {
            const result = await serverActionCreateRoom(dataCreate, index_room, code_video);

            if (result.error.statusCode !== 0) {

                setDataCreate(prevState => ({
                    ...prevState,
                    error: result.error,
                    success: { code_video: "", username_video: "", host: "true" }
                }));

            } else {

                setDataCreate(prevState => ({
                    ...prevState,
                    success: result.success,
                    error: { statusCode: 0, statusMessage: "" }
                }));

            }
        } catch (error) {

            console.error("Client-side error:", error);
            setDataCreate(prevState => ({
                ...prevState,
                error: { statusCode: 500, statusMessage: "An unexpected error occurred" },
                success: { code_video: "", username_video: "", host: "true" }
            }));

        } finally{
            setLoading(false);
        };

    };

    async function handleSubmitToJoin(e:FormEvent<HTMLFormElement> ){
        e.preventDefault();
        setLoading(true);

        const index_username:number = usernames.findIndex(el => el === dataJoin.form.username.trim().replaceAll(" ", "_"));
        const index_room:number = rooms.findIndex(el => el === dataJoin.form.code.trim().replaceAll(" ", ""));

        try {
            const result = await serverActionJoinRoom(dataJoin, index_username, index_room);

            if (result.error.statusCode !== 0) {

                setDataJoin(prevState => ({
                    ...prevState,
                    error: result.error,
                    success: { code_video: "", username_video: "", host: "false" }
                }));

            } else {

                setDataJoin(prevState => ({
                    ...prevState,
                    success: result.success,
                    error: { statusCode: 0, statusMessage: "" }
                }));

            }
        } catch (error) {

            console.error("Client-side error:", error);
            setDataJoin(prevState => ({
                ...prevState,
                error: { statusCode: 500, statusMessage: "An unexpected error occurred" },
                success: { code_video: "", username_video: "", host: "false" }
            }));

        } finally{
            setLoading(false);
        };
    };

    function handleChangeToCreate(e:ChangeEvent<HTMLInputElement>){
        setDataCreate({
            ...dataCreate, form: {
                ...dataCreate.form,
                [e.target.name]: e.target.value
            }
        });
    };

    function handleChangeToJoin(e:ChangeEvent<HTMLInputElement>){
        setDataJoin({
            ...dataJoin, form: {
                ...dataJoin.form,
                [e.target.name]: e.target.value
            } 
        });
    };

    useEffect(() => {
        if(dataJoin.form.code.length !== 11) return;

        onValue(ref(database, `${dataJoin.form.code}/users`), (snapshot) => {
            const data = snapshot.val();
            if(data === null) return setUsernames([]);
            setUsernames(Object.keys(data));
        });
    }, [dataJoin.form]);

    useEffect(() => {
        onValue(ref(database, 'rooms'), (snapshot) => {
            const data = snapshot.val();
            if(data === null) return setRooms([]);
            setRooms(Object.keys(data));
        });
    }, [dataJoin.form, dataCreate.form]);

    useEffect(() => {
        if(!dataCreate.success.code_video) return;

        if(window){
            setSessionStorageCode(dataCreate.success.code_video);
            setSessionStorageUsername(dataCreate.success.username_video);
            setSessionStorageHost(dataCreate.success.host);
        };
    }, [dataCreate.success]);

    useEffect(() => {
        if(window){
            setSessionStorageCode(dataJoin.success.code_video);
            setSessionStorageUsername(dataJoin.success.username_video);
            setSessionStorageHost(dataJoin.success.host);
        };
    }, [dataJoin.success]);

    useEffect(() => {
        if(!sessionStorageCode && !sessionStorageUsername) return;
        
        router.push(`/cinema_room/${sessionStorageCode}`);     
    }, [sessionStorageCode, sessionStorageUsername, router]);

    return(
        <div className="container-fluid text-center">
            <form className="row" onSubmit={handleSubmitToCreate}>
                <div className="p-2">
                    <div className="card text-bg-dark mb-3">
                        <label htmlFor="usernameInputCreating" className="form-label card-header">Username // Example: Alejo_DB</label>
                        <div className="card-body">
                            <input type="text" className="form-control" id="usernameInputCreating" name="username" value={dataCreate.form.username} onChange={handleChangeToCreate} placeholder="Any username you like" />
                            {dataCreate.error.statusCode === 400 &&
                                <ShowErrMessages text={dataCreate.error.statusMessage} />
                            }
                        </div>

                        <label htmlFor="urlInput" className="form-label card-header">Url to Create Room</label>
                        <div className="card-body">
                            <p className="card-text">Example: https://www.youtube.com/watch?v=Qw8D1FGhfwg</p>
                            <p className="card-text">Example: https://youtu.be/Qw8D1FGhfwg?si=DB3mVas7oxqrd2aR</p>
                            <input type="text" className="form-control" id="urlInput" name="url_yt" value={dataCreate.form.url_yt} onChange={handleChangeToCreate} placeholder="Url youtube's video" />
                            {dataCreate.error.statusCode === 404 &&
                                <ShowErrMessages text={dataCreate.error.statusMessage} />
                            }
                            {dataCreate.error.statusCode === 405 &&
                                <ShowErrMessages text={dataCreate.error.statusMessage} />
                            }
                        </div>
                        <div className="col-sm-12 p-3">
                            {dataCreate.error.statusCode === 500 &&
                                <ShowErrMessages text={dataCreate.error.statusMessage} />
                            }
                            <button type="submit" className="btn btn-success w-100" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
                        </div>
                    </div>
                </div>
            </form>

            <form className="row" onSubmit={handleSubmitToJoin}>
                <div className="p-2">
                    <div className="card text-bg-dark mb-3">
                        <label htmlFor="usernameInputJoining" className="form-label card-header">Username // Example: Alejo_DB</label>
                        <div className="card-body">
                            <input type="text" className="form-control" id="usernameInputJoining" name="username" value={dataJoin.form.username} onChange={handleChangeToJoin} placeholder="Any username you like" />
                            {dataJoin.error.statusCode === 400 &&
                                <ShowErrMessages text={dataJoin.error.statusMessage} />
                            }
                            {dataJoin.error.statusCode === 405 &&
                                <ShowErrMessages text={dataJoin.error.statusMessage} />
                            }
                        </div>

                        <label htmlFor="codeInput" className="form-label card-header">Code to Join Room</label>
                        <div className="card-body">
                            <p className="card-text">Example: Qw8D1FGhfwg </p>
                            <input type="text" className="form-control" id="codeInput" name="code" value={dataJoin.form.code} onChange={handleChangeToJoin} placeholder="Code cinema room" />
                            {dataJoin.error.statusCode === 406 &&
                                <ShowErrMessages text={dataJoin.error.statusMessage} />
                            }
                            {dataJoin.error.statusCode === 404 &&
                                <ShowErrMessages text={dataJoin.error.statusMessage} />
                            }
                        </div>
                        <div className="col-sm-12 p-3">
                            {dataJoin.error.statusCode === 500 &&
                                <ShowErrMessages text={dataJoin.error.statusMessage} />
                            }
                            <button type="submit" className="btn btn-success w-100" disabled={loading}>{loading ? "Joining..." : "Join"}</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

function ShowErrMessages({text}:{text:string}){
    return(
        <p className="card-text pt-2 text-danger h-4">{text}</p>
    );
};