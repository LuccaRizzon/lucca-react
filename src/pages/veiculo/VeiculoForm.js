import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import ROUTES from '../../routes';
import InputFormRegex from '../../components/InputFormRegex';

const VeiculoForm = ({ onSuccess }) => {
  const { id } = useParams();
  const veiculoId = id ? parseInt(id, 10) : null;
  const [placa, setPlaca] = useState('');
  const [renavam, setRenavam] = useState('');
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const isValid =
      placa.length === 7 &&
      renavam.replace(/[^0-9]/g, '').length === 11 &&
      modelo.length >= 1 &&
      marca.length >= 1 &&
      String(ano).length === 4;

      console.log({
        placaLengthValid: placa.length === 7,
        renavamLengthValid: renavam.replace(/[^0-9]/g, '').length === 11,
        modeloValid: modelo.length >= 1,
        marcaValid: marca.length >= 1,
        anoLengthValid: String(ano).length === 4,
        anoLength: String(ano).length,
        ano,
        isValid,
      });

    setIsFormValid(isValid);
  };

  useEffect(() => {
    if (veiculoId) {
      fetchVeiculo();
    }
  }, [veiculoId]);

  useEffect(() => {
    validateForm();
  }, [ placa, renavam, modelo, marca, ano, cor ]);

  const fetchVeiculo = async () => {
    try {
      const response = await API.get(`/veiculo/${veiculoId}`);
      const { placa, renavam, modelo, marca, ano, cor } = response.data;
      setPlaca(placa || '');
      setRenavam(renavam || '');
      setModelo(modelo || '');
      setMarca(marca || '');
      setAno(ano || '');
      setCor(cor || '');
      validateForm();
    } catch (error) {
      console.error('Erro ao retornar veiculo:', error);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.VEICULO_LIST);
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
      const veiculoData = { placa, renavam, modelo, marca, ano, cor };

      if (veiculoId) {
        await API.put(`/veiculo/${veiculoId}`, veiculoData);
      } else {
        await API.post('/veiculo', veiculoData);
      }

      setSnackbar({
        open: true,
        message: `Veiculo ${veiculoId ? 'atualizado' : 'criado'} com sucesso!`,
        severity: 'success',
      });

      setTimeout(() => {
        setLoading(false);
        handleBack();
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar veiculo:', error);
      setSnackbar({
        open: true,
        message: 'Ocorreu um erro ao salvar o veiculo. Por favor, tente novamente.',
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
      <h1 className="text-center mb-4">{veiculoId ? 'Editar Veiculo' : 'Novo Veiculo'}</h1>
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
          <InputFormRegex
            mask={[
              /[A-Za-z]/,
              /[A-Za-z]/,
              /[A-Za-z]/,
              /[0-9]/,
              /[A-Za-z]/,
              /[0-9]/,
              /[0-9]/,
            ]}
            label="Placa"
            value={placa}
            desiredLength="7"
            onChange={(e) => {
              const newValue = e.target.value.toUpperCase();
              setPlaca(newValue);
            }}
            placeholder="Digite a placa"
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <InputFormRegex
            mask={[
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
            ]}
            label="Renavam"
            value={renavam}
            desiredLength="11"
            onChange={(e) => {
              setRenavam(e.target.value);
            }}
            placeholder="Digite o renavam"
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <InputFormRegex
            value={modelo}
            label="Modelo"
            placeholder="Digite o modelo"
            onChange={(e) => {
              setModelo(e.target.value);
            }}
            disabled={loading}
            required
          />
        </div>
        <div className="mb-3">
          <InputFormRegex
            value={marca}
            placeholder="Digite o marca"
            label="Marca"
            onChange={(e) => {
              setMarca(e.target.value);
            }}
            disabled={loading}
            required
          />
        </div>
        <div className="mb-3">
          <InputFormRegex
            mask={[
              /[1-2]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
            ]}
            label="Ano"
            value={ano}
            placeholder="Digite o ano"
            desiredLength="4"
            onChange={(e) => {
              setAno(e.target.value);
            }}
            disabled={loading}
            required
          />
        </div>
        <div className="mb-3">
          <InputFormRegex
            value={cor}
            label="Cor"
            placeholder="Digite a cor"
            onChange={(e) => {
              setCor(e.target.value);
            }}
            disabled={loading}
            required
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={loading}>
            Voltar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading || !isFormValid}>
            {veiculoId ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VeiculoForm;
