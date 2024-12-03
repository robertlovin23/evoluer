import {useRef, useEffect, version} from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'webrtc-adapter'
import RecordRTC from 'recordrtc'
import 'videojs-record/dist/css/videojs.record.css';
import Record from 'videojs-record/dist/videojs.record.js';


const VideoJSComponent = ({options, onPlayerReady}) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        if(!playerRef.current){
            const videoElement = document.createElement('video-js');

            videoElement.className = 'video-js vjs-default-skin';
            videoRef.current.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, options, () => {
                // print version information at startup
                const version_info = 'Using video.js ' + videojs.VERSION +
                ' with videojs-record ' + videojs.getPluginVersion('record') +
                ', recordrtc ' + RecordRTC.version + ' and React ' + version;
                videojs.log(version_info);

                onPlayerReady && onPlayerReady(player);
            });
        } else {

        }
    }, [options, videoRef])

    useEffect(() => {
        const player = playerRef.current;

        return () => {
            if(player && !player.isDisposed()){
                player.dispose();
                playerRef.current = null;
            }
        }
    }, [playerRef])

    return (
        <div data-vjs-player>
          <div ref={videoRef} />
        </div>
      );

}   

export default VideoJSComponent