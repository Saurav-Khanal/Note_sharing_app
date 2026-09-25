import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom" ;
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from './pages/Dashboard';
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/Dashboard" element={<Dashboard/>}/>
      <Route path="/" element={<Login/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
