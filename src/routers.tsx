import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound.tsx';
import Home from './pages/Home.tsx';
import Projeto from './pages/Projeto.tsx';
import Header from './pages/Header.tsx';
import Contratantes from './pages/Contratantes.tsx';

const AppRoutes = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/projeto/:ID_Projeto" element={<Projeto />} />
        <Route path='/contratantes' element={<Contratantes />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
