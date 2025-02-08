import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound.tsx';
import { SignIn } from './pages/SignIn.tsx';
import { Profile } from './pages/Profile.tsx';
import Home from './pages/Home.tsx';
import Projeto from './pages/Projeto.tsx';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/projeto/:ID_Projeto" element={<Projeto />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
