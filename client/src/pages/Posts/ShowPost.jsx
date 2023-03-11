import { useEffect , useRef, useState} from 'react';
import {Spinner , Alert} from 'reactstrap'
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import {BiEdit} from 'react-icons/bi'
import {RiDeleteBin6Line} from 'react-icons/ri'
import {AiOutlineHeart , AiFillHeart , AiOutlineShareAlt , AiOutlineComment} from 'react-icons/ai'
import axios from 'axios';
// Icons
function ShowPost(){
    
    const link = useParams();
    const [post, setPost] = useState();
    const [newTitle , setNewTitle] = useState("");
    const [error , setError] = useState("");
    const [comments , setComments] = useState([]);
    const [InputComment , setInputComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [edit , setEdit] = useState(false);
    const [Like , setLike] = useState(false);
    const [Likes , setLikes] = useState([]);
    useEffect(()=>{
        axios({
            method: 'post',
            url: '/posts/'+link.id,
          }).then(res =>{
            setPost(res.data)
            setNewTitle(res.data.title)
            setComments(res.data.comments)
            setLoading(false);
            setLikes(res.data.likes.length)
            res.data.likes.filter(like => like.user.toString() === localStorage.getItem("id").toString()).length > 0 ? setLike(true) : setLike(false)
          })
    },[])

    const postComment = (e) =>{
        e.preventDefault();
        const data ={
            id:post._id,
            comment: InputComment,
        }
        axios.put("http://localhost:5000/posts/comment" , data).then(res =>{
            if(res.data.msg == "Done"){
                // setShow({...post,comments:res.data.data})
                window.location.reload();
            }
            else if(res.data.msg === "please enter a comment"){
                setError("يجب عليك ان تكب شئ")
            }
            else{
                setError("هناك مشكله في نشر التعليق")
            }
            
            
        })
    }

    const SwitchToEdit = () =>{
      if(edit == false){
        setEdit(true);
      }else{
        setEdit(false);
      }
    }
    const EditPost = () =>{
     axios.put("http://localhost:5000/posts/edit/"+link.id , {title:newTitle}).then(res =>{
      if(res.data == "Done"){
        window.location.reload();
      }else if(res.data == "please enter a title"){
        setError("يجب  عليك كتابه العنوان")
      }
       })
     
    }

    const DeletePost = () =>{
      axios.delete("/posts/delete/"+link.id).then(res =>{
        if(res.data == "Done"){
          window.location.href = '/'
        }
      })
    }

    const LikePost = () =>{
      axios.post("/posts/like/"+link.id).then(res =>{
        setLike(true)
        setLikes(Likes +1)
      })
    }

    const DesLikePost = () =>{
      axios.post("/posts/deslike/"+link.id).then(res =>{
        setLike(false)
        setLikes(Likes -1)
      })
    }

    if(loading == true){
      return(
        <div style={{position:"absolute" ,width:'100%' , height:'100%', top:'0' , left:'0' , display:"flex" , alignItems:"center" , justifyContent:"center" }}>
          <Spinner />
        </div>
      )
    }
    else{
      return(
        <div className='Show'>
            <NavLink to={'/profile/'+post.author._id} className='author'>
                    <p>{post.author.name}</p>
                    <img src={'../users/'+post.author.avatar} alt={post.author.name}></img>
            </NavLink>

              {localStorage.getItem("id") === post.author._id ? 
              <div className='Edit'>
              <RiDeleteBin6Line onClick={DeletePost}/>
              <BiEdit onClick={SwitchToEdit}/>
            </div>:""  
            }
            <div className='post'>
                {edit ? <><input id='title' value={newTitle} onChange={(e)=>{setNewTitle(e.target.value)}}></input><button onClick={EditPost}>حفظ</button></> : <p id='title'>{post.title}</p>}
                <img src={'../posts/'+post.src} alt={post.title}></img>
                <div className='options'>
                  {Like == true ? <AiFillHeart id='like' onClick={DesLikePost} color='red'/> : <AiOutlineHeart id='like' onClick={LikePost} />}<span>{Likes}</span>
                  <AiOutlineComment color='#1d1e20d4'/><span>{post.comments.length}</span>
                </div>
            </div>
            <div className='comments'>
              { 
                localStorage.getItem('token') && localStorage.getItem('id') ? 
                <div className='add_comment'>
                <form onSubmit={postComment}>
                    <textarea type='text' placeholder='اكتب تعليق' value={InputComment} onChange={(e)=>{setInputComment(e.target.value)}}></textarea>
                    <button>نشر</button>
                </form>
              </div>:
              <div className='add_comment_gest'>
                <form onSubmit={postComment}>
                    <textarea type='text' placeholder='اكتب تعليق' value={InputComment} onChange={(e)=>{setInputComment(e.target.value)}}></textarea>
                    <button>نشر</button>
                </form>
              </div> 
              }
              {comments.map((comment,i) =>{
                return(
                  <div className='author_comment'>
                      <NavLink to={'/profile/'+comment.author._id} className='author'>
                      <p>{comment.author.name}</p>
                      <img src={'../users/'+comment.author.avatar} alt={comment.author.name}></img>
                    </NavLink>
                    <pre className='comment'>{comment.comment}</pre>
                  </div>
                )
              })}
            </div>
        </div>
        )
    }
}

export default ShowPost;