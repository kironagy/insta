import './Home.scss'
import {FiShare2} from 'react-icons/fi'
import {AiOutlineHeart , AiOutlineComment , AiOutlineShareAlt, AiFillHeart} from 'react-icons/ai'
import React,{ lazy, useEffect, useState } from 'react';
import {Alert , Spinner} from 'reactstrap'
import axios from 'axios';
import { NavLink , Link } from 'react-router-dom';
function Home(){
    const [Show , setShow] = useState();
    const [posts , setPosts] = useState([]);
    const [InputComment , setInputComment] = useState("");
    const [loading , setLoading] = useState(true);
    useEffect(()=>{
        axios.get("/posts/all").then(res =>{
            setPosts(res.data.reverse())
            setLoading(false);
        })
    },[])
    if(loading){
        return(
            <div style={{position:'absolute', top:'0',display:"flex" , width:'100%' , height:'100%' , alignItems:'center' , justifyContent:'center'}}>
                <Spinner color='danger'></Spinner>
            </div>
        )
    }
 
    return(
        <div className="Home">
            <h1>اخر ما تم مشاركته</h1>
            <div className='posts'>
                {posts.map((post , i) =>{
                    return(
                        <NavLink to={'/posts/'+post._id} className='post' key={post._id}>
                            <div className='author'>
                                <p>{post.author.name}</p>
                                <img src={'/users/upload/avatar/'+post.author.avatar}></img>
                            </div>
                           <div>
                                <p id='title'>{post.title}</p>
                                <img loading='lazy' src={'/posts/upload/posts/'+post.src} alt={post.title}></img>
                                {localStorage.getItem("token") || localStorage.getItem("id") 
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
                        </NavLink>
                    )
                })}
            </div>
        </div>
    )
}

export default Home;