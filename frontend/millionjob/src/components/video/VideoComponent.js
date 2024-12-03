import { useRef } from 'react'
import VideoJSComponent from './VideoJSComponent'

const VideoComponent = ({onVideoUpload}) => {
    const playerRef = useRef(null)
    const videoJsOptions = {
        controls: true,
        bigPlayButton: false,
        width:560,
        height: 240,
        fluid: false,
        plugins: {
            record: {
                audio: true,
                video: true,
                maxLength: 120,
                debug: true
              }
        }
    }

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        player.on('deviceReady', () => {
            console.log('device is ready')
        })

        player.on('startRecord', () => {
            console.log('started Recording')
        })

        player.on('finishRecord', ()=> {
            console.log('finished recording: ', player.recordedData);
            onVideoUpload(player.recordedData); 
        })

        player.on('error', (el, err) => {
            console.warn(err)
        })

        player.on('deviceError', () => {
            console.error('device error:', player.deviceErrorCode)
        })
    }

    return(
        <div style={{width: "100%"}}>
            <VideoJSComponent options={videoJsOptions} onPlayerReady={handlePlayerReady}/>
        </div>
    )
}

export default VideoComponent