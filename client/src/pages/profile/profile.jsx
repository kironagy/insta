import './profile.scss'
import {BiShow } from 'react-icons/bi'
import {FiShare2} from 'react-icons/fi'
import {BiLike} from 'react-icons/bi'
import {AiOutlineComment , AiOutlineHeart , AiOutlineShareAlt , AiFillHeart} from 'react-icons/ai'
import {IoExit} from 'react-icons/io5'
import {TbEdit} from 'react-icons/tb'
import {useEffect, useState , useRef } from 'react'
import { NavLink, useParams } from 'react-router-dom';
import { Spinner } from 'reactstrap'
import axios from 'axios';
function Profile(){
    const link = useParams();
    const [User , setUser] = useState({name:"" , bio:"" , id:""});
    const [avatar , setAvatar] = useState("")
    const [Edit , setEdit] = useState(false);
    const [newName , setNewName] = useState("");
    const [newBio , setNewbio] = useState("");
    const [newPic , setNewPic] = useState({});
    const [error , setError] = useState("");
    const [posts , setPosts] = useState([])
    const [loading , setLoading] = useState(true);
    const PicRef = useRef();

    useEffect(()=>{
         axios.get("/users/profile/"+link.id).then(user =>{
            setUser(user.data)
            setAvatar(user.data.avatar);
            setPosts(user.data.posts.reverse())
            setNewName(user.data.name)
            setNewbio(user.data.bio)
            setLoading(false)
        }).catch(err =>{
            if(err.response.data === "This Account Not Found"){
                setError("This Account not found")
            }
        })
    },[])

    const SwitchPage = () =>{
        if(Edit == false){
            setEdit(true)
        }else{
            setEdit(false)
        }
    }
    const SaveChange = () =>{
        const form = new FormData();
        form.append("name", newName);
        form.append("bio", newBio);
        form.append("src", newPic.file);
        axios({
            method: 'put',
            url: '/users/edit',
            data : form,
            headers: {
              'Authorization': localStorage.getItem("token"),
              'Content-Type': 'multipart/form-data',
            }
          }).then(res =>{
           if(res.data == "DONE"){
                window.location.reload();
           }
          })
    }

    const ChangeInput = (e)=>{
        switch (e.target.name){
            case "name":
                setNewName(e.target.value)
                break;
            case "bio":
                setNewbio(e.target.value)
                break;
           
        }
    }

    const UploadPhoto = (e)=>{
        e.preventDefault();
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = () =>{
            setNewPic({file:e.target.files[0] , src:reader.result})
        }
    }

    const Exit = ()=>{
        localStorage.removeItem("id")
        localStorage.removeItem("token")
        window.location.href ='/';
    }

    const PicRefrence = (e)=>{
        PicRef.current.click();
    }
   
        if(loading){
            return(
                <div style={{position:'absolute', top:'0',display:"flex" , width:'100%' , height:'100%' , alignItems:'center' , justifyContent:'center'}}>
                    <Spinner color='danger'></Spinner>
                </div>
            )
        }
        if(error == "This Account not found"){
            return(
                <div className="Profile">
                    <h1 style={{textAlign:"center"}}>Not Found</h1>
                </div>
            )
        }else{
            return (
                <div className="Profile">
                    {User.id == localStorage.getItem("id") ? <div className='exit'><IoExit onClick={Exit}></IoExit></div> : ""}
                    <div className='info'>

                        <div className='pic'>
                            {localStorage.getItem("id") == User.id ? <TbEdit className='edit' onClick={SwitchPage}></TbEdit> : ""}
                            <input type='file' ref={PicRef} onChange={UploadPhoto} style={{visibility:'hidden', position:'absolute'}}></input>
                            {Edit ? <><img onClick={PicRefrence} src={newPic.src || '../../users/'+avatar} alt='profile pic'></img></> : <img src={'../../users/'+User.avatar} alt='profile pic'></img>}
                        </div>
                        <div className='Name'>
                            {Edit ? <input value={newName} onChange={ChangeInput} name='name' placeholder='Name'></input> : <h1>{User.name}</h1>}
                            {Edit ? <input value={newBio} onChange={ChangeInput} name='bio' placeholder='وصف لك'></input> : <p>{User.bio}</p>}
                            {Edit ? <button onClick={SaveChange}>حفظ</button> : ''}
                        </div>
                    </div>
        
                    <p id='title'>منشورات الحساب</p>
        
                    {posts.map(post =>{
                        return(
                            <NavLink to={'/posts/'+post._id} key={post._id} >
                                <div className='posts'>
                                <div className='post'>
                                        <p id='title'>{post.title}</p>
                                        <img src={'../posts/'+post.src} alt='/'></img>
                                        {localStorage.getItem("token") && localStorage.getItem("id") 
                                            ?
                                            <div className='options'>
                                            {post.likes.filter(like => like.user.toString() === localStorage.getItem("id").toString()).length > 0 ? <AiFillHeart id='like' color='red'/> : <AiOutlineHeart id='like'  />}<span>{post.likes.length}</span>
                                            <AiOutlineComment color='#1d1e20d4'/><span>{post.comments.length}</span>
                                            </div>
                                            : 
                                                <div className='options'>
                                                <AiOutlineHeart id='like'  /><span>{post.likes.length}</span>
                                                <AiOutlineComment color='#1d1e20d4'/><span>{post.comments.length}</span>
                                                </div>
                                            }
                                    </div>
                                </div>
                              
                            </NavLink>
                        )
                    })}
                </div>
            )
        }
       
    
}
export default Profile;