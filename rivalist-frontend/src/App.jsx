import React from "react";
import Nav from "./components/Navbar";
import "./App.css";
import LandingPage from "./components/pages/LandingPage";
import {Routes , Route} from 'react-router-dom'
import LoginPage from './components/LoginPage.jsx'
function App() {
  

  return (
    <div className="h-screen">
      <Nav />
      <Routes>
        <Route path = "/" element={<LandingPage/>}/>
        <Route path = "/login" element={<LoginPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
