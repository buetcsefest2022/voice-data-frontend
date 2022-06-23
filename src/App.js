// import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route,  Navigate}
  from 'react-router-dom';
import './App.css';
// import Audio from './Component/Audio';
import { Configuration } from '@react-md/layout';

// import NavbarElements from './Component/NavbarElements';
// import Login from './pages/Login';
import { useState } from 'react';
import AudioNavigator from './Component/AudioNavigator'
import LoginNavigator from './pages/LoginNavigator';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [creds, setCreds] = useState({});

  return (
    <div className="App">
      <Router>
        {/* <NavbarElements name="" setLoggedIn={(val)=>{setLoggedIn(val)}} loggedIn={loggedIn}> </NavbarElements> */}
        <Routes>
        <Route path='/' element={<LoginNavigator setCreds={(val) => {setCreds(val)}} loggedIn={loggedIn} setLoggedIn = {(val) => {setLoggedIn(val)}}/>} />
        <Route exact path='/upload' element={<Configuration><AudioNavigator setLoggedIn={(val) => {setLoggedIn(val)}} creds={creds} loggedIn = {loggedIn}></AudioNavigator></Configuration>} />
          {/* <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/sign-up' element={<SignUp />} /> */}
        <Route
            path="*"
            element={<Navigate to="/" replace />}
        />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
