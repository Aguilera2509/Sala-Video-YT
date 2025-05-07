export interface DataJoinState {
    form: {
        username: string;
        code: string;
    };
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

export interface DataCreateState {
    form: {
        username: string;
        url_yt: string;
    };
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

export interface DetailsOptionVideo {
    currentTime: number;
    volume: number;
    pause: boolean;
    speedVideo: number;
    // quality?: string;  // Optional property (commented out)
    // mute?: boolean;     // Optional property (commented out)
    // SphericalProperties?: null; // Consider a more specific type if needed
}