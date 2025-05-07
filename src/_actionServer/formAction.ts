"use server"

import { database } from "@/_lib/firebaseApi/firebase_credentials";
import { ref, set } from "firebase/database";

import { DataCreateState, DataJoinState } from "@/_lib/type";

interface CustomError {
    statusCode: number;
    statusMessage: string;
};

export async function serverActionCreateRoom(dataCreate:DataCreateState, index_room:number, code_video:string){
    try {
        const data:DataCreateState = {
            form: {
                username: dataCreate.form.username.trim().replaceAll(" ", "_"),
                url_yt: dataCreate.form.url_yt.trim().replaceAll(" ", ""),
            },
            error: {
                statusCode: 0,
                statusMessage: ""
            },
            success: {
                code_video: "",
                username_video: "",
                host: "true"
            }
        };

        if(data.form.username.length < 3) throw {
            statusCode: 400,
            statusMessage: "Bad Request. Username must contain at least 3 letters"
        };
    
        if(!/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=([a-zA-Z0-9_-]+){11})(?:&.*)?$/.test(data.form.url_yt)) throw {
            statusCode: 404,
            statusMessage: "Not Found. Make sure the url belongs to youtube or it be written correctly"
        };
    
        if(index_room !== -1) throw{
            statusCode: 405,
            statusMessage: "Not Allowed, Cinema Room already exists"
        };

        create_room_db(code_video);
        writeUserDB(data.form.username, code_video);

        return {
            ...data, success: {
                code_video,
                username_video: data.form.username,
                host: "true"
            }
        };

    } catch (error:any) {
        const customError: CustomError = {
            statusCode: (error as CustomError).statusCode || 500,
            statusMessage: (error as CustomError).statusMessage || "An unexpected error occurred"
        };

        return {
            form: {
                username: dataCreate.form.username,
                url_yt: dataCreate.form.url_yt
            },
            error: customError,
            success: {
                code_video: "",
                username_video: "",
                host: "true"
            }
        };
    };
};

export async function serverActionJoinRoom(dataJoin: DataJoinState, index_username:number, index_room:number) {
    try {
        const data:DataJoinState = {
            form: {
                username: dataJoin.form.username.trim().replaceAll(" ", "_"),
                code: dataJoin.form.code.trim().replaceAll(" ", ""),
            },
            error: {
                statusCode: 0,
                statusMessage: ""
            },
            success: {
                code_video: "",
                username_video: "",
                host: "false"
            }
        };

        if (data.form.username.length < 3) throw {
            statusCode: 400,
            statusMessage: "Bad Request. Username must contain at least 3 letters"
        };

        if (data.form.code.length !== 11) throw {
            statusCode: 406,
            statusMessage: "Not Acceptable. Make sure the code is written correctly"
        };

        if(index_username !== -1) throw {
            statusCode: 405,
            statusMessage: "Not Allowed, Name is already in used"
        };

        if(index_room === -1) throw {
            statusCode: 404,
            statusMessage: "Not Found, Cinema Room not existing"
        };

        writeUserDB(data.form.username, data.form.code);

        return {
            ...data, success: {
                code_video: data.form.code,
                username_video: data.form.username,
                host: "false"
            }
        };

    } catch (error:any) {
        const customError: CustomError = {
            statusCode: (error as CustomError).statusCode || 500,
            statusMessage: (error as CustomError).statusMessage || "An unexpected error occurred"
        };

        return {
            form: {
                username: dataJoin.form.username,
                code: dataJoin.form.code
            },
            error: customError,
            success: {
                code_video: "",
                username_video: "",
                host: "false"
            }
        };
    };
};

function create_room_db(code_video:string) {
    set(ref(database, 'rooms/' + code_video), { 
        code_video
    });
};

function writeUserDB(username:string, code_video:string) {
    set(ref(database, `${code_video}/users/` + username), { 
        username
    });
};