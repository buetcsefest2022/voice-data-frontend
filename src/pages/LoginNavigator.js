import { useNavigate} from "react-router-dom";
import Login from "./Login"
import {useEffect} from 'react'
import NavbarElements from "../Component/NavbarElements";

function LoginNavigator(props){
    let navigate = useNavigate()
    // console.log(props.loggedIn)

    useEffect(() => {
        if (props.loggedIn){
         navigate("/upload")   
        }
    },[])

    return (
        <div>
            <NavbarElements name="" setLoggedIn={(val)=>{props.setLoggedIn(val)}} loggedIn = {props.loggedIn}/>
            <Login setCreds={(val) => {props.setCreds(val)}} setLoggedIn = {(val)=>{props.setLoggedIn(val)}}/>
        </div>
    )
}

export default LoginNavigator;