import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage"
import CreateRoomPage from "./CreateRoomPage"
import RoomJoinPage from "./RoomJoinPage"
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

export default class App extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (
        <div className="center">
          <HomePage />
        </div>
      );
    }
  }
  
const appDiv = document.getElementById("app");
render(<App />, appDiv);