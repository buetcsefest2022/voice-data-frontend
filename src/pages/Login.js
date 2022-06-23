import React, { useState } from 'react'
import { auth } from '../firebaseConfig'
import {  
          signInWithEmailAndPassword, 
          // signOut,
        } from "firebase/auth"
import { useNavigate } from 'react-router-dom'


function Login(props) {

  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');

  const [loginPassword, setLoginPassword] = useState('');

  // const [user, setUser] = useState({});

  const login = async(event) => {
    event.preventDefault();
    // console.log("login");
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      // console.log(user);
      let creds = {email: user.user.email, uid: user.user.uid}
      // console.log(creds);
      props.setCreds(creds);
      props.setLoggedIn(true);
      navigate("/upload");
    } catch (error) {
      props.setLoggedIn(false);
      props.setCreds({email: null, uid: null});
      console.log(error.message);
      alert("Authentication Failed!");
    }
  }

  // const logout = async () => {
  //   await signOut(auth);
  // };

  // onAuthStateChanged(auth, (currentUser) => {
  //   setUser(currentUser);
  // })

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   // setLoginEmail(event.target[0].value, (email) => {
  //   //   console.log(email);
  //   // });
  //   // setLoginPassword(event.target[1].value, (pass) => {
  //   //   console.log(pass);
  //   // });
  //   // console.log();
  //   // login();
    
    
  // }


  return (
    <div>
      <form onSubmit={(event) => {login(event)}}>
        <h3 id='signin'>Sign In</h3>
        <div className='d-flex justify-content-center'>
          <div className="d-flex mb-3 w-25">
            <input
              id="login-id"
              type="email"
              className="form-control"
              placeholder="Enter email"
              onBlur = {(event) => {
                setLoginEmail(event.target.value);
              }}
            />
          </div>
          </div>
          <div className='d-flex justify-content-center'>
          <div className="d-flex mb-3 w-25">
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              onBlur = {(event) => {
                setLoginPassword(event.target.value);
              }}
            />
          </div>
          </div>
          <div className='d-flex justify-content-center'>
          <div className="d-grid w-25">
            <button type="submit" className="btn btn-primary" >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login

// export default class Login extends Component {
//   render() {
//     return (
//       <form>
//         <h3 id='signin'>Sign In</h3>
//         <div className='d-flex justify-content-center'>
//           <div className="d-flex mb-3 w-25">
//             <input
//               type="email"
//               className="form-control"
//               placeholder="Enter email"
//             />
//           </div>
//           </div>
//           <div className='d-flex justify-content-center'>
//           <div className="d-flex mb-3 w-25">
//             <input
//               type="password"
//               className="form-control"
//               placeholder="Enter password"
//             />
//           </div>
//           </div>
//           <div className='d-flex justify-content-center'>
//           <div className="d-grid w-25">
//             <button type="submit" className="btn btn-primary">
//               Submit
//             </button>
//           </div>
//         </div>
//       </form>
//     )
//   }
// }