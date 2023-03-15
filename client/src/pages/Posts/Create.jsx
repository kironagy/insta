import './Create.scss'
import {React , useState , useEffect , useRef} from 'react';
import {GoFileMedia} from 'react-icons/go'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import axios from 'axios';
import {Alert, Spinner} from 'reactstrap'
import  { BrowserRouter } from 'react-router-dom'
function CreatePost(){
    const InputRef = useRef();
    const BtnRef = useRef();
    const ImgRef = useRef();
    const [title , setTitle] = useState("");
    const [Img , setImg] = useState();
    const [Loding , setLoding] = useState(false);
    const [show , setShow] = useState(null);
    const [error , setError] = useState();
    useEffect(()=>{
       
      if(title === ''){
        BtnRef.current.style.backgroundColor='#c7c1c1';
        BtnRef.current.style.cursor='not-allowed';
        BtnRef.current.onclick = (e)=>{
            e.preventDefault();
        }
      }
    },[])
    
    const InputChange = (e) =>{
        setTitle(e.target.value.replace('  ',' ').replace('\n' , ''));
        if(e.target.value !== ''){
            BtnRef.current.style.backgroundColor='#2958f5';
            BtnRef.current.style.cursor='pointer';
            BtnRef.current.onclick = (e)=>{
            }
        }else if(e.target.value =='' && show == null){
            BtnRef.current.style.backgroundColor='#c7c1c1';
            BtnRef.current.style.cursor='not-allowed';
            BtnRef.current.onclick = (e)=>{
                e.preventDefault();
            }
        }
    }
    const OpenFiles = (e)=>{
        ImgRef.current.click();
    }
    const UploadImg = (e)=>{
        e.preventDefault();
        BtnRef.current.style.backgroundColor='#2958f5';
        BtnRef.current.style.cursor='pointer';
        BtnRef.current.onclick = (e)=>{
            
        }
        try{
            if(e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/png" ||e.target.files[0].type === "image/gif"){
                if(e.target.files[0] && e.target.files[0].size < 1361782){
                    const reader = new FileReader();
   
                    new Promise(()=>{
                       reader.readAsDataURL(e.target.files[0]);
                       reader.onprogress = ()=>{
                           setLoding(true)
                       }
                   
                       reader.onloadend = ()=>{
                            setImg(e.target.files[0])
                           setShow(reader.result)
                           setLoding(false)
                           setError("")
                       }
                   })
               }else if(e.target.files[0].size > 1361782){
                   setError("mbاكبر مساحه هي 1.5")
               }
            }else{
                setError("gif | png | jpeg  صيغ الصور المسموحه ")
            }
         
        }catch(err){
            console.log(err);
        }
       
    }
    const onSubmit = (e)=>{
        e.preventDefault();
        const form = new FormData();
        form.append('title', title);
        form.append('src', Img);
        try{
           if(Img){
            if(title){
                axios({
                    method: 'post',
                    url: '/posts/create',
                    data:form,
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    }
                  }).then(res =>{
                    if(res.data == "Done"){
                      window.location.href='/'
                    }
                  })
            }else{
                setError("يجب عليك كتابه عنوان")
            }
           }else{
            setError("يجب عليك رفع صوره")
           }
       
        }catch(err){
            setError("هناك مشكله ما")
        }

    }
    if(!localStorage.getItem('token') || !localStorage.getItem('id')){
        window.location.href = "/"
    }
    else{
        return(
            <div className='CreatePost'>
                <div className='box'>
                    <p id='title'>أنشئ منشورًا</p>
                    {error ? <Alert color='danger'>{error}</Alert> : ""}
                    <form onSubmit={onSubmit} >
                       <textarea type='text' placeholder='اكتب عنوان المشنور هنا ' value={title} ref={InputRef} onChange={InputChange}></textarea>
                        <div className='Img'>
                            {Loding == true ? <Spinner color='danger'/> : ""}
                            {show ? <img src={show}></img> : ""}
                        </div>
                       <div className='options'>
                        <GoFileMedia onClick={OpenFiles} />
                        <input style={{visibility:'hidden'}} type='file' ref={ImgRef} onChange={UploadImg}></input>
                        <button ref={BtnRef}>نشر</button>
                       </div>
                    </form>
                </div>
            </div>
        )
    }
    
}

export default CreatePost;