import { useNavigate} from "react-router-dom";
import Audio from "./Audio"
import {useEffect} from 'react'
import NavbarElements from './NavbarElements'

function AudioNavigator(props){
    let navigate = useNavigate()

    useEffect(() => {
        if (!props.loggedIn){
         navigate("/")   
        }
    },[])

    return (
    <div>
        <NavbarElements name="" setLoggedIn={(val)=>{props.setLoggedIn(val)}} loggedIn = {props.loggedIn}/>
        <Audio creds={props.creds} loggedIn={props.loggedIn}/>
    </div>
    )
}

export default AudioNavigator;