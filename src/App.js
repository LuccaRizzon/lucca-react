import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Main from './components/Main';
import MotoristaList from './pages/motorista/MotoristaList';
import MotoristaForm from './pages/motorista/MotoristaForm';
import VeiculoList from './pages/veiculo/VeiculoList';
import VeiculoForm from './pages/veiculo/VeiculoForm';
import Map from './components/Map';
import ROUTES from './routes';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="mb-4">Sistema de cadastros feito com Node.js e React</h1>
      <div className="d-flex gap-3">
        <button className="btn btn-primary" onClick={() => navigate(ROUTES.MOTORISTA_LIST)}>
          Motoristas
        </button>
        <button className="btn btn-primary" onClick={() => navigate(ROUTES.VEICULO_LIST)}>
          Veículos
        </button>
        <button className="btn btn-warning text-danger" onClick={() => navigate(ROUTES.BONUS)}>
          Bônus
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.MOTORISTA_LIST} element={<MotoristaList />} />
          <Route path={ROUTES.MOTORISTA_EDIT} element={<MotoristaForm />} />
          <Route path={ROUTES.MOTORISTA_FORM} element={<MotoristaForm />} />
          <Route path={ROUTES.VEICULO_LIST} element={<VeiculoList />} />
          <Route path={ROUTES.VEICULO_FORM} element={<VeiculoForm />} />
          <Route path={ROUTES.VEICULO_EDIT} element={<VeiculoForm />} />
          <Route path={ROUTES.BONUS} element={<Map />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
