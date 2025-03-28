// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import Course from './course';
import Dept from './Dept';
import LoginAs from './LoginAs';
import Login from './Login';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/course" element={<Course />} />
      <Route path="/department" element={<Dept />} />
      <Route path="/login" element={<LoginAs />} />
      <Route path="/loginInfo" element={<Login />} />


    </Routes>
  );
}

export default App;