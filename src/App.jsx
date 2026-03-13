import './App.css'
//import Dashboard from './pages/Dashboard.jsx';
//import Login from './pages/Login.jsx';
import SignUp from "./pages/SignUp.jsx";
import Calendar from "daisyui/components/calendar/index.js";
import Calender from "./pages/Calender.jsx";
import Login from "./pages/Login.jsx";
//import Calender from './pages/Calender.jsx';

function App() {


  return (
       <div className="m-10">
           <Calender />
           <div/><div className="m-10">
           <Login /></div>
           <div className="m-10">
           <SignUp /></div>
        </div>

  )
}

export default App
