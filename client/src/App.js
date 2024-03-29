import {BrowserRouter as Router , Switch , Route, Redirect} from 'react-router-dom'
import axios from 'axios';
// All Components
import Navbar from './pages/Navbar/Navbar';
import Home from './pages/Home/Home';
import CreatePost from './pages/Posts/Create';
import Profile from './pages/profile/profile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { useEffect, useState } from 'react';
import ShowPost from './pages/Posts/ShowPost.jsx';
import NotFound from './pages/NotFound/NotFound'

function App() {
  const [user , setUser] = useState({})
  useEffect(()=>{
    axios.defaults.headers.common['authorization'] = localStorage.getItem("token");
    axios({
      method: 'post',
      url: '/users/me',
      headers: {
        'authorization': localStorage.getItem("token"),
        // 'Content-Type': 'application/json'
      }
    }).then(res =>{
      setUser(res.data);
    }).catch(err =>{
      if(localStorage.getItem("token") || localStorage.getItem("id")){
        localStorage.removeItem("token");
        localStorage.removeItem("id");
      }
    })
  },[])
  return (
    <div className="App">
      <Router>
        <Navbar avatar={user.avatar}/>
        <Switch>

          <Route exact path='/' component={Home}></Route>
          <Route path='/profile/:id' component={Profile}></Route>
          <Route path='/posts/:id' component={ShowPost}></Route>
          {localStorage.getItem("token") || localStorage.getItem("id") ? <Route path='/create-post' component={CreatePost}></Route> : ''}
          {localStorage.getItem("token") || localStorage.getItem("id") ?  "" :<Route path='/login' component={Login}></Route>}
          {localStorage.getItem("token") || localStorage.getItem("id") ? '' : <Route path='/register' component={Register}></Route>}
          <Route path='*' component={NotFound}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
