import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomRoutes from "./component/route/routes";
import Login from "component/LoginPages/Login";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "component/route/ProtectedRoute";
import store from "component/Store";
import { useEffect, useState } from "react";



function App() {
  const dispatch = useDispatch()
  const [isAuthenticated, setAuthenticated] = useState(localStorage.getItem('login'));
  
  const storage = localStorage.getItem('token');
  const token = storage && storage.split('; ').find(row => row.startsWith('token='));
  useEffect(() => {
    if (token) {  
    localStorage.setItem('login', true) 
    setAuthenticated(true); // Dispatch login action if token is present
  }
}, [token]) 
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
        <Route index element={<Login/>} />
          <Route path="/*" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CustomRoutes />
          </ProtectedRoute>
          } />
        </Routes>
      </Router>
    
    </div>
  );
}

export default App;
// 
