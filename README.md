# Context 

Purpose of this project is educational, imagine a room where a professor can be controlling a specific **YouTube's video** to all his students and his students can ask any question using a chat.

Or you want to be spent time with a abroad friend or partner wacthing a **YouTube's video** together, right now you can, only one needs to create the room called **Cinema Room** through input the video's url and share the **CODE** to others to join in.

The dependencies of this project are:

> Run -> npm install to install the dependencies

* Firebase v11.6.1
* Bootstrap v5.3.3
* Motion v12.6.3
* Next v15.2.4 using Ts
* React and React-Dom both v19.0.0

> Into the depedencies it was Pusher but it was removed in the newerst version because Firebase make the same and more simple.

> Also Pusher create a connection to the server when the component that uses the API is called no matter if server gets an url or not keeping always an empty connection, that problem was solved calling the API into a component like this:

```js
    const PusherLib = async () => {
        const pusherClient = (await import('@/_lib/pusherAPI/client_pusher')).default;

        channel = pusherClient.subscribe(sessionStorageCode);
                        
        channel.bind('incoming-data-video-yt', (detailsVideo:DetailsOptionVideo) => {
            setDetailsVideo((prev) => ({...prev, currentTime: detailsVideo.currentTime, volume: detailsVideo.volume, pause: detailsVideo.pause, speedVideo: detailsVideo.speedVideo }));
        });
    };
```

# About code

```ts

const DETAILS_VIDEO:DetailsOptionVideo = {
    currentTime: 0,
    volume: 67,
    pause: true,
    speedVideo: 1,
    count: 0, //Auxiliar
    //quality: "",
    //mute: false,
    //SphericalProperties: null
};

```

**HOST** only can be sending that data, his own currentTime, volume, pause and speedV ideo because those details are most relevant details about the video.

* Count is only a var to send and receive new data while the video is paused and validate the viewers doesn't go ahead of the **HOST** or too back.

* Mute is not relevant to everyone if the **HOST** don't want to hear the video he can mute his own video and the viewers can still hear it.

* Quality is deprecated as they say here: 
[YouTube's Api](https://developers.google.com/youtube/iframe_api_reference)

> October 24, 2019 ->
The documentation has been updated to reflect the fact that the API no longer supports functions for setting or retrieving playback quality. To give you the best viewing experience, YouTube adjusts the quality of your video stream based on your viewing conditions.
The changes explained below have been in effect for more than one year. This update merely aligns the documentation with current functionality:
The getPlaybackQuality, setPlaybackQuality, and getAvailableQualityLevels functions are no longer supported. In particular, calls to setPlaybackQuality will be no-op functions, meaning they will not actually have any impact on the viewer's playback experience.
The queueing functions for videos and playlists -- cueVideoById, loadVideoById, etc. -- no longer support the suggestedQuality argument. Similarly, if you call those functions using object syntax, the suggestedQuality field is no longer supported. If suggestedQuality is specified, it will be ignored when the request is handled. It will not generate any warnings or errors.
The onPlaybackQualityChange event is still supported and might signal a change in the viewer's playback environment. See the Help Center article referenced above for more information about factors that affect playback conditions or that might cause the event to fire.

* SphericalProperties is not added

# Privacy

Project don't save any info about the rooms(viewers, chats) or videos(urls, details) when everyone is out of the room, all the info get deleted.
After all This project is the product NOT the users.

## Previous Version

Actually this is a much better version of one of my previous projects due to:

1. Better performance because when there is only one person into the room the server is not getting info to others users/viewers. It's the **HOST** is out then everyone can control his own video without **HOST**'s limitation being a little bit free, and the **HOST** if it's not alone into the room it's always sending his options to the viewers, like volume, speedVideo, currentTime and pause every 1 second is the video is playing or every 4 second is the video is paused.

2. Better Look because the previous version only counted with not responsive video or chat and a **Cinema Room** disgusting to the eye

3. Better Info due to now the **Cinema Room** count with a nav-bar where you can see the viewers into the room that you are in, **CODE** to share and an exit button.

>**Note: The previous version is not associated to this new version.** 

attaching images soon..