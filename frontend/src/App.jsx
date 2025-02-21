import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoutes from './pages/ProtectedRoutes';
function App() {
  return (
     <div className='App'>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />   
          <Route element={<ProtectedRoutes />} >
            <Route path='/home' element={<Home />} />  
          </Route>
        </Routes>
     </div>
        
  )
}

export default App
