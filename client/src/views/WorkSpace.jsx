import { useEffect, useState } from "react";
import { Canvas } from "../components/Canvas";
import { Ui } from "../components/Ui";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../provider/AppStates";
import { socket } from "../api/socket";
import { BrushSettings } from "../components/BrushSettings";
import TextInput from "../components/TextInput";

export const WorkSpace = () => {
  const [searchParams] = useSearchParams();
  const { setSession, elements } = useAppContext();
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  
  useEffect(() => {
    const room = searchParams.get("room");
    if (room) {
      console.log(`Joining room: ${room}`);
      socket.emit("join-room", room);
      setSession({ room });
      
      // Send current elements to the server
      socket.emit("getElements", { elements, room });
    }
    
    // Add socket event listeners
    socket.on("connect", () => {
      console.log("Connected to server in WorkSpace");
      setConnectionStatus("Connected");
    });
    
    socket.on("disconnect", () => {
      console.log("Disconnected from server in WorkSpace");
      setConnectionStatus("Disconnected");
    });
    
    socket.on("connect_error", (error) => {
      console.error("Connection error in WorkSpace:", error);
      setConnectionStatus("Connection Error");
    });
    
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [searchParams, setSession, elements]);
  
  return (
    <>
      <Ui />
      <Canvas />
      <BrushSettings />
      <TextInput />
      <div style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        background: 'rgba(0,0,0,0.7)', 
        color: 'white', 
        padding: '5px 10px', 
        borderRadius: '5px',
        zIndex: 1000
      }}>
        Status: {connectionStatus}
      </div>
    </>
  );
};