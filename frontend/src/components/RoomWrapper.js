import React from "react";
import { useParams } from "react-router-dom";
import Room from "./Room";

function RoomWrapper() {
  const { roomCode } = useParams();
  return <Room roomCode={roomCode}/>;
}

export default RoomWrapper;