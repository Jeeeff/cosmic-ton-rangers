
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import FarmProgress from './pages/FarmProgress';
import Economics from './pages/Economics';
import Stats from './pages/Stats';
import Inventory from './pages/Inventory';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/farm" element={<FarmProgress />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/economics" element={<Economics />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
