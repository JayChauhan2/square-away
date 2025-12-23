import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import SquareAwayLanding from './components/SquareAwayLanding'
import Questions from './components/Questions'

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link> | <Link to="/questions">Questions</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<SquareAwayLanding />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </div>
  )
}

export default App
