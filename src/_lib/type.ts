interface responseData{
    error: {
        statusCode: number;
        statusMessage: string;
    };
    success: {
        code_video: string;
        username_video: string;
        host: string;
    };
};

export interface DataJoinState extends responseData {
    form: {
        username: string;
        code: string;
    };
};

export interface DataCreateState extends responseData {
    form: {
        username: string;
        url_yt: string;
    };
};

export interface DetailsOptionVideo {
    currentTime: number;
    volume: number;
    pause: boolean | "null";
    speedVideo: number;
    count: number;
    mute: boolean;
    // quality?: string;  // Optional property (commented out)
    // SphericalProperties?: null; // Consider a more specific type if needed
}