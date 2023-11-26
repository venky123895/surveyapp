import React,{useState,useEffect} from 'react';
import './App.css';
import NavBar from './Components/navBar/NavBar';
import SimpleSidebar from './Components/sidebar/SideBar';
import {Routes,Route} from 'react-router-dom'
import ImagePage from './Components/Pages/ImagePage';
import { AuthModal } from './Components/Authentication/AuthModal';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Home from './Components/Home/Home';
import WelcomePage from './Components/Pages/WelcomePage/WelcomePage';

function App() {
  const[user,setUser]=useState<any>(null)

  useEffect(()=>{
    onAuthStateChanged(auth,user=>{
      if(user) setUser(user)
      else setUser(null)
    })
  },[])
  
  return (
    <div className="App">
      <NavBar user={user}/>
      {
        user ? (
          <Routes>
            <Route path='/' element={<SimpleSidebar/>}>
              <Route path='' element={<Home/>}/>
                <Route path='Images' element={<ImagePage/>}/>
                <Route path='/*' element={<ImagePage/>}/>
            </Route>
          </Routes>
        ) : <WelcomePage/>
      }
      
      
    </div>
  );
}

export default App;
