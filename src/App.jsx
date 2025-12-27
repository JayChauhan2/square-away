import './App.css'
import { Routes, Route } from "react-router-dom";
import FloatingNavbar from './components/FloatingNavbar';

import SquareAwayLanding from './components/SquareAwayLanding'
import Questions from './components/Questions';
import Practice from './components/Practice';

function App() {
  return (
    <div className="App relative bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Navbar is fixed */}
      <FloatingNavbar />

      {/* Padding ensures content starts below the navbar */}
      <div className="pt-14">
        <Routes>
          <Route path="/" element={<SquareAwayLanding />} />
          <Route path="/questions/:topic" element={<Questions />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </div>
    </div>
  )
}


export default App;
