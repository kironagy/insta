import {NavLink} from 'react-router-dom'
import './Navbar.scss'
import axios from 'axios';
import { useEffect, useState } from 'react';
function Navbar(props){
    const [avatar , setAvatar] = useState("")
    useEffect(()=>{
        axios.post("/users/avatar" , {id:localStorage.getItem("id")}).then(user =>{
            setAvatar(user.data.avatar)
        })
    },[])
    return(
        <div className="Navbar">
                <ul>
                    {localStorage.getItem("token") && localStorage.getItem("id") ? <div className='profile'>
                        <NavLink to={'/profile/'+localStorage.getItem("id")}><img src={'../../users/'+avatar} alt='profile pic'></img></NavLink>
                    </div> : ""}
                    <li>
                        <NavLink to="/">الرئيسيه</NavLink>
                    </li>
                    <li>
                        {localStorage.getItem("token") && localStorage.getItem("id") ? <NavLink to="/create-post">أنشاء منشور</NavLink> : <NavLink to="/login">تسجيل الدخول</NavLink>}
                    </li>
                </ul>
        </div>
    )
}
export default Navbar;