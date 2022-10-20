import React from 'react';
import './App.css';
import { useState } from 'react';
import Instant from './components/instant';
import Login from './views/login/login';
import Home from './views/home/home';
import gitlogo from './static/gitlogo.png';

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
      <div className='git'>
          <a href='https://github.com/s-alad/toofake' target="_blank">
            <img src={gitlogo} /> source code
          </a>
        </div>
    </div>
  );
}

export default App;
