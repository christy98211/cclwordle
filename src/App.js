import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import "./App.css";
import Game from "./components/Game";
import React from 'react';
import Amplify from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);



function App() {
  const darkHandler = (dark) => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };
  
  return (
    <div className={"app dark:bg-zinc-800"}>
      <Game darkness={darkHandler} />
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
