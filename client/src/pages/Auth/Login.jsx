import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Alert } from 'reactstrap';
import './Login.scss'
import axios from 'axios';

function Login(){
    const [Email , setEmail] = useState("");
    const [Password , setPassword] = useState("");
    const [error , setError] = useState("");
    const onChangeInput = (e)=>{
        switch(e.target.name){
            case "Email":
                setEmail(e.target.value);
                break;
            case "Password":
                setPassword(e.target.value);
                break;
        }
    }

    const onSubmit = (e)=>{
        e.preventDefault();
        const data ={
            email:Email,
            password:Password
        }
        if(Email && Password !==''){
            axios.post('/users/login' , data ).then(res =>{
            if(res.data == "password is invalid"){
                setError("كلمه المرور غير صحيحه")
            }
            else{
                if(res.data == "User not found"){
                    setError("هذا الحساب غير موجود")
                }
                else if(res.data !=={}){
                    try{
                        localStorage.setItem("token" , res.data.token)
                        localStorage.setItem("id" , res.data.id)
                        window.location.href = "/";
                    }catch(err){
                        setError("There is an error in the data")
                    }
                }
            }
            
        })
        }
    }


    if(localStorage.getItem("token") || localStorage.getItem("id")){
        window.location.href = "/"
    }
    return(
        <div className='Login'>
            <form onSubmit={onSubmit}>
                <p>تسجيل الدخول</p>
                {error ? <Alert color='danger'>{error}</Alert>:""}
                <input type='email' placeholder='البريد الاكتروني' name='Email' value={Email} onChange={onChangeInput}></input>
                <input type='password' autoComplete='false' placeholder='كلمه المرور' name='Password' value={Password} onChange={onChangeInput}></input>
                <button>تسجيل الدخول</button>
                <NavLink to='/register'>! أنشاء حساب</NavLink>
            </form>
        </div>
    )
}
export default Login;