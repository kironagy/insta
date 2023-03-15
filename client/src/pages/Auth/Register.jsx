import { useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Alert } from 'reactstrap';

function Register(){
    const [Name , setName] = useState("");
    const [Email , setEmail] = useState("");
    const [Password , setPassword] = useState("");
    const [Password2 , setPassword2] = useState("");
    const [error , setError] = useState("");

    const onChangeInput = (e)=>{
        switch(e.target.name){
            case "Name":
                setName(e.target.value);
                break;
            case "Email":
                setEmail(e.target.value);
                break;
            case "Password":
                setPassword(e.target.value);
                break;
            case "Password2":
                setPassword2(e.target.value);
                break;
        }
    }

    const onSubmit = (e) =>{
        e.preventDefault();
        if(Name && Email && Password && Password2 !==''){
            if(Password!== Password2){
                setError("كلمتي المرور لا تطابق بعدهم");
            }else{
                axios.post("/users/create", {
                    name: Name,
                    email: Email,
                    password: Password
                })
              .then(res => {
                    try{
                        localStorage.setItem("token" , res.data.token)
                        localStorage.setItem("id" , res.data.id)
                        window.location.href = "/";
                    }catch(err){
                        setError("هناك مشكله في البيانات")
                    }
                    
                }).catch(err =>{
                    if(err.response.data.message == "This Account Used"){
                        setError("هذا الحساب مستخدم بالفعل")
                    }
                })
            
            }
        }else{
            setError("يجب عليك ملئ جميع الحقول");
        }
    
    }

    if(localStorage.getItem("token") || localStorage.getItem("id")){
        window.location.href='/'
    }
    else{
        return(
            <div className="Register">
                 <form onSubmit={onSubmit}>
                    <p>أنشاء حساب جديد</p>
                    {error ? <Alert color='danger'>{error}</Alert>:""}
                    <input type='text'  placeholder='اسمك' name='Name' value={Name} onChange={onChangeInput}></input>
                    <input type='email' placeholder='البريد الاكتروني' name='Email' value={Email} onChange={onChangeInput}></input>
                    <input type='password' placeholder='كلمه المرور' name='Password' value={Password} onChange={onChangeInput}></input>
                    <input type='password' placeholder='تاكيد كلمه المرور' name='Password2' value={Password2} onChange={onChangeInput}></input>
                    <button>أنشاء حساب</button>
                    <NavLink to='/login'>! تسجيل الدخول</NavLink>
                </form>
            </div>
        )
    }
}
export default Register;