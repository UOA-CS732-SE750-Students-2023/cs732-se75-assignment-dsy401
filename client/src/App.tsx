import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Login} from "./screens/Login";
import {Main} from "./screens/Main";
import {NotFound} from "./screens/NotFound";

const App = () => {
  return (
      <BrowserRouter>
          <div>
              <Routes>
                  <Route path='/login' element={<Login/>}/>
                  <Route path='/main/*' element={<Main/>}/>
                  <Route path="*" element={<Login/>}/>
              </Routes>
          </div>
      </BrowserRouter>
  );
}

export default App;
