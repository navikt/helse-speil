import React from "react";
import "./App.css";
import HeaderBar from "./HeaderBar/HeaderBar";

export default class App extends React.Component {
   render() {
      return (
         <div>
            <HeaderBar displayname="Ukjent Ukjentsen" />
            <div className="main">main content</div>
         </div>
      );
   }
}
