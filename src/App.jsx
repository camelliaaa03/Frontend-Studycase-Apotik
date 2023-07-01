import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth, Form } from "@/layouts";
// import {SignIn} from "@/pages/auth";
import SignIn from "./pages/auth/sign-in";
// import EditCategory from "@/pages/form/editCategory";

function App() {
  
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/form/*" element={<Form />}/>
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      
      {/* <Route exact path="/form/editCategory" element={<EditCategory/>}/> */}

    </Routes>
  );
}

export default App;
