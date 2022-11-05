import React from 'react';
import './App.css';
import { useState } from 'react';
import Instant from './components/instant';
import Login from './views/login/login';
import Home from './views/home/home';
import gitlogo from './static/gitlogo.png';

function App() {

  const [login, setLogin] = useState(false)
  function auth() {setLogin(true);}

  function verify(): boolean {
    if (localStorage.getItem('idtoken') != null) {
      if (Date.now() > parseInt(localStorage.getItem('expiration') ?? '0')) {
        const rtok = localStorage.getItem('refresh');
        fetch(`/refresh/${rtok}`).then(
          (value) => {return value.json()}
        ).then(
          (data) => {
            localStorage.setItem('refresh', data['refresh_token'])
            localStorage.setItem('idtoken', data['id_token'])
            localStorage.setItem('expiration', (Date.now() + parseInt(data['expires_in']) * 1000).toString())
          }
        ).then(
          () => {return true;}
        )
      }
      return true;
    } else {return login}
  }

  return (
    <div className="App">
      <div className='toofake'>
          TooFake
          <div className='space'>|</div>
          <div className='befake'>
            post a bereal
          </div>
      </div>
      {
        (verify()) ?
          <Home></Home> 
          :
          <Login auth={auth}></Login>
      }
      <div className='git'>
          <a href='https://github.com/s-alad/toofake' target="_blank">
            <img src={gitlogo} /> source code
          </a>
          <a>about</a>
        </div>
    </div>
  );
}

export default App;
