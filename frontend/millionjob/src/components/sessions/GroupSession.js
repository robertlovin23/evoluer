import { JitsiMeeting } from "@jitsi/react-sdk";

const GroupSession = ({ roomName, displayName}) => {
    return(
        <div style={{height: "100vh", width: "100%"}}>
                  <JitsiMeeting
        roomName={roomName} // Unique room name for the group session
        userInfo={{
          displayName: displayName, // User's name
        }}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        onApiReady={(externalApi) => {
          // Use Jitsi's API for further customizations
          console.log(externalApi)
          console.log("Jitsi API is ready");
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100vh";
          iframeRef.style.width = "100%";
        }}
      />
        </div>
    )
}

export default GroupSession

// import { useEffect, useRef, useState } from "react";
// import Peer from "peerjs";

// const GroupSession = ({ roomName, displayName}) => {
// const [peerId, setPeerId] = useState(null);

// const videoRef = useRef(null);

// useEffect(() => {
//   const peer = new Peer();

//   peer.on("open", (id) => {
//     setPeerId(id);
//     console.log("My peer ID is:", id);
//   });

//   peer.on("call", async (call) => {
//     const response =  await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//     const stream = response.stream()
//     call.answer(stream)
//     call.on("stream", (remoteStream) => {
//         videoRef.current.srcObject = remoteStream
//     })
        
//   })

//   return () => {
//     peer.destroy();
//   }
  

// }, [])


// }

// export default GroupSession