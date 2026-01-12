import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Rangers from './pages/Rangers';
import Missions from './pages/Missions';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import FarmProgress from './pages/FarmProgress';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/rangers" element={<Rangers />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/farm" element={<FarmProgress />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
