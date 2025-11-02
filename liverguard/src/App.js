import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/Signup/Signup";
import Layout from "./components/Layout/Layout";
import Page1 from "./pages/Page1/Page1";
import Page2 from "./pages/Page2/Page2";
import Page3 from "./pages/Page3/Page3";
import Page4 from "./pages/Page4/Page4";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* sidebar 없음 */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        
        {/* sidebar 있음 */}
        <Route element={<Layout />}>
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} />
          <Route path="/page4" element={<Page4 />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
