import React from 'react'
import { NavLink } from 'react-router-dom'
import "./Navbar.css"
import {useNavigate} from 'react-router-dom';


function NavbarElements(props) {
    const navigate = useNavigate()
    const handleLogOut = () => {
        props.setLoggedIn(false);
        navigate('/')
    }

    return (
        <div className="navbar bg-secondary">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <a className="navbar-brand" href="#">
            {/* <NavLink className="navbar-brand" to={'/'}> */}
                <img src="/buet-logo.png" width="30" height="30" className="d-inline-block align-top" alt="" />
                BUET CSE DATATHON 2022
            {/* </NavLink> */}
            </a>
            {/* <a class="active" href="/home">BUET CSE DATATHON 2022</a> */}
            {/* <a href="#"><i class="fa fa-fw fa-search"></i> Search</a>
                <a href="#"><i class="fa fa-fw fa-envelope"></i> Contact</a> */}
            {/* <a href="/"><i className="fa fa-fw fa-user"></i> {props.name ? props.name : "LOGIN"}</a> */}
            {/* <button className="btn btn-outline" onClick={props.setLoggedIn(false)} >Search</button> */}
            {props.loggedIn ? <button className="btn btn-outline-warning mx-5" onClick={()=>{handleLogOut()}} >Logout</button>: null}
        </div>
    )
}

export default NavbarElements

// function NavbarElements(props){
//     return(
//         <nav class="navbar navbar-light bg-light">
//             <a class="navbar-brand" href="#">
//                 <img src="/buet-logo.png" width="30" height="30" class="d-inline-block align-top" alt=""/>
//                 Bootstrap
//             </a>
//         </nav>
//     );
// }
// export default NavbarElements;