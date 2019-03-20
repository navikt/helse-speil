import React from "react";
import HeaderBar from "./HeaderBar/HeaderBar";
import Applicant from "./Applicant/Applicant";
import "./App.css";

export default class App extends React.Component {
   render() {
      return (
         <div>
            <HeaderBar displayname="S. Aksbehandler" />
            <Applicant />
            <div className="main">main content</div>
         </div>
      );
   }
}
