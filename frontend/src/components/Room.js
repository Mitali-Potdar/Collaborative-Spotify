import React, { useState, useEffect } from "react";
import {
Grid, Button, Typography 
} from '@mui/material';
import { useParams, useNavigate,Link } from 'react-router-dom';
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default function Room(props) {
  const [roomDetails, setRoomDetails] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false,
    song: {},
  });
   
  
  const { roomCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getRoomDetails();
  }, []);

  useEffect(() => {
    const interval = setInterval(getCurrentSong, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []); 

  const getRoomDetails = () => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          props.leaveRoomCallback();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => { 
        setRoomDetails({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      });
  };
   
  useEffect(() => {
    if (roomDetails.isHost) {
      authenticateSpotify();
    }
}, [roomDetails.isHost]); 


  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
      setRoomDetails(prevRoomDetails => ({
        ...prevRoomDetails,
        spotifyAuthenticated: data.status,
      }));
      if (!data.status) {
        fetch("/spotify/get-auth-url")
          .then((response) => response.json())
          .then((data) => {
            window.location.replace(data.url);
          });
      }
      });

  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setRoomDetails(prevRoomDetails => ({
          ...prevRoomDetails,
          song: data,
        }));
        console.log(data);
      });
  }
  
  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      props.leaveRoomCallback();
      navigate("/");
    });
  };

 const updateShowSettings = (value) =>{
    setRoomDetails({
      showSettings: value,
    });
  }
  
  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={roomDetails.votesToSkip}
            guestCanPause={roomDetails.guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };


  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  if (roomDetails.showSettings) {
    return renderSettings();
  }

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" component="h3">
            Code: {roomCode}
          </Typography>
        </Grid>
        <MusicPlayer {...roomDetails.song} />
        {roomDetails.isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick = {leaveButtonPressed}
          >
            Leave Room
          </Button>
          
        </Grid>
      </Grid>
    );
}