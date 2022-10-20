import React from 'react';
import './App.css';
import { useState } from 'react';
import Instant from './components/instant';
import Login from './views/login/login';
import Home from './views/home/home';

function App() {

  const [login, setLogin] = useState(true)
  function auth() {
    setLogin(false)
  }

  return (
    <div className="App">
      <div className='toofake'>
        TooFake
      </div>
      {

        (login && !(sessionStorage.getItem('token') != null)) ? 
        <Login auth={auth}></Login>
        : 
        <Home></Home>
      }
    </div>
  );
}

export default App;
