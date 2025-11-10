import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/Signup/Signup";
import Layout from "./components/Layout/Layout";
import Page1 from "./pages/Page1/Page1";
import Page2 from "./pages/Page2/Page2";
import Dashboard1 from "./pages/dashboard/dashboard_1";
import Dashboard2 from "./pages/dashboard/dashboard_2";
import Page3 from "./pages/Page3/Page3";
import Profile from "./pages/Profile/Profile";
import Pharmacy from "./pages/Pharmacy/Pharmacy";
import DDI from "./pages/DDI/DDI";
// import Page4 from "./pages/Page4/Page4";
import EditBloodResultForm from "./components/Page2/EditBloodResultForm";
import CreateBloodResultForm from "./components/Page2/CreateBloodResultForm";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* sidebar 없음 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* sidebar 있음 */}
        <Route element={<Layout />}>
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/dashboard1" element={<Dashboard1 />} />
          <Route path="/dashboard2" element={<Dashboard2 />} />
          <Route path="/page3" element={<Page3 />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/bloodresult/create" element={<CreateBloodResultForm />} />
          <Route path="/bloodresult/edit/:id" element={<EditBloodResultForm />} />
          <Route path="/ddi" element={<DDI/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
