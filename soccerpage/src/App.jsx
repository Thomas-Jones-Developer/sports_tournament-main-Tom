import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import SoccerPage from './SoccerPage';



function App() {
  

  return (
    <>
    <BrowserRouter>
    {/* <Link to='/'>Home(LOGO)</Link>
    <Link to='about'>About</Link> */}
    <SoccerPage/>


    <Routes>
      <Route path="/"></Route>
    </Routes>
    
    
    
    </BrowserRouter>



    </>
  )
}

export default App
