import React, { useState, useEffect } from 'react';
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room"
import {
    BrowserRouter as Router,
    Switch,
    Routes,
    Route,
    Link,
    Redirect,
    Navigate
  } from "react-router-dom";

  import {
    Button,
    ButtonGroup,
    Grid,
    Typography,
  } from '@mui/material';

  export default function HomePage() {
    const [roomCode, setRoomCode] = useState(null);
  
    const clearRoomCode = () => {
      setRoomCode(null);
    };
  
    useEffect(() => {
      fetch('/api/user-in-room')
        .then((response) => response.json())
        .then((data) => {
          setRoomCode(data.code);
        });
    }, []);
  
    const renderHomePage = () => {
      if (roomCode) {
        return <Navigate to={`/room/${roomCode}`} replace={true} />;
      } else {
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} align="center">
              <Typography variant="h3" compact="h3">
                House Party
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <ButtonGroup disableElevation variant="contained" color="primary">
                <Button color="primary" to="/join" component={Link}>
                  Join a Room
                </Button>
                <Button color="secondary" to="/create" component={Link}>
                  Create a Room
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        );
      }
    };
  
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={renderHomePage()} />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route
            path="/room/:roomCode"
            element={
              roomCode ? (
                <Room leaveRoomCallback={clearRoomCode} roomCode={roomCode} />
              ) : (
                renderHomePage()
              )
            }
          />
        </Routes>
      </Router>
    );
  }
