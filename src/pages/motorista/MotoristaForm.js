import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import InputForm from '../../components/InputForm';
import ROUTES from '../../routes';

const MotoristaForm = ({ onSuccess }) => {
  const { id } = useParams();
  const motoristaId = id ? parseInt(id, 10) : null;
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [telefone, setTelefone] = useState('');
  const [veiculos, setVeiculos] = useState([]);
  const [selectedVeiculo, setSelectedVeiculo] = useState([]);
  const [initialSelectedVeiculo, setInitialSelectedVeiculo] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const isValid =
      nome.length > 0 &&
      cpf.replace(/[^0-9]/g, '').length === 11 &&
      rg.replace(/[^0-9]/g, '').length === 9 &&
      telefone.replace(/[^0-9]/g, '').length === 11 &&
      (selectedVeiculo || motoristaId);

    setIsFormValid(isValid);
  };

  useEffect(() => {
    if (motoristaId) {
      fetchMotorista();
    }
    fetchVeiculos();
  }, [motoristaId]);

  useEffect(() => {
    validateForm();
  }, [nome, cpf, rg, telefone, selectedVeiculo, loading]);

  const fetchMotorista = async () => {
    try {
      const response = await API.get(`/motorista/${motoristaId}`);
      const { nome, cpf, rg, telefone, veiculo } = response.data;
      setNome(nome || '');
      setCpf(cpf || '');
      setRg(rg || '');
      setTelefone(telefone || '');
      setSelectedVeiculo(veiculo?.id || '');
      setInitialSelectedVeiculo(veiculo?.id || []);
      validateForm();
    } catch (error) {
      console.error('Erro ao retornar motorista:', error);
    }
  };

  const fetchVeiculos = async () => {
    try {
      const response = await API.get('/veiculo');
      setVeiculos(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.MOTORISTA_LIST);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setSnackbar({
        open: true,
        message: 'Por favor, preencha todos os campos corretamente.',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const motoristaData = {
        nome,
        cpf,
        rg,
        telefone,
        ...(selectedVeiculo ? { veiculo: { id: selectedVeiculo } } : {}),
      };

      if (motoristaId) {
        await API.put(`/motorista/${motoristaId}`, motoristaData);
      } else {
        await API.post('/motorista', motoristaData);
      }

      setSnackbar({
        open: true,
        message: `Motorista ${motoristaId ? 'atualizado' : 'criado'} com sucesso!`,
        severity: 'success',
      });

      setTimeout(() => {
        setLoading(false);
        handleBack();
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar motorista:', error);
      setSnackbar({
        open: true,
        message: 'Ocorreu um erro ao salvar o motorista. Por favor, tente novamente.',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">{motoristaId ? 'Editar Motorista' : 'Novo Motorista'}</h1>
      <Backdrop
        open={loading}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          opacity: 0.8,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            maxLength="100"
            className="form-control"
            placeholder="Digite o nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <InputForm
            value={cpf}
            label="CPF"
            mask="999.999.999-99"
            desiredLength={11}
            placeholder="Digite o CPF"
            onChange={setCpf}
            disabled={loading}
            required
          />
        </div>
        <div className="mb-3">
          <InputForm
            value={rg}
            label="RG"
            mask="99.999.999-9"
            desiredLength={9}
            placeholder="Digite o RG"
            onChange={setRg}
            disabled={loading}
            required
          />
        </div>
        <div className="mb-3">
          <InputForm
            value={telefone}
            label="Telefone"
            mask="(99) 99999-9999"
            desiredLength={11}
            placeholder="Digite o Telefone"
            onChange={setTelefone}
            disabled={loading}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="veiculo" className="form-label">
            Veículo
          </label>
          <select
            id="veiculo"
            className="form-select"
            value={selectedVeiculo}
            onChange={(e) => setSelectedVeiculo(e.target.value)}
            disabled={loading}
          >
            <option value="">Selecione um veículo</option>
            {veiculos.map((veiculo) => (
              <option
                key={veiculo.id}
                value={veiculo.id}
                disabled={!veiculo.available && veiculo.id !== initialSelectedVeiculo}
              >
                {veiculo?.marca} - {veiculo?.modelo} - {veiculo.placa}{" "}
                {!veiculo.available && veiculo.id !== initialSelectedVeiculo && "(Indisponível)"}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={loading}>
            Voltar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading || !isFormValid}>
            {motoristaId ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MotoristaForm;
