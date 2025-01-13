import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import API from '../../services/api';
import ROUTES from '../../routes';

const MotoristaList = () => {
  const [motoristas, setMotoristas] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMotoristas();
  }, [paginationModel]);

  const fetchMotoristas = async () => {
    setLoading(true);
    try {
      const { page, pageSize } = paginationModel;
      const response = await API.get('/motorista', {
        params: { page: page + 1, pageSize },
      });
      setMotoristas(response.data.data);
      setRowCount(response.data.total);
    } catch (error) {
      console.error('Erro ao retornar motoristas:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar motoristas. Por favor, tente novamente.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMotorista = async (id) => {
    setLoading(true);
    try {
      await API.delete(`/motorista/${id}`);
      setMotoristas(motoristas.filter((motorista) => motorista.id !== id));
      setSnackbar({
        open: true,
        message: 'Motorista deletado com sucesso!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Erro ao deletar motorista:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao deletar motorista. Por favor, tente novamente.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      fetchMotoristas();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: 'nome', headerName: 'Nome', flex: 1 },
    { field: 'cpf', headerName: 'CPF', flex: 1 },
    { field: 'rg', headerName: 'RG', flex: 1 },
    { field: 'telefone', headerName: 'Telefone', flex: 1 },
    {
      field: 'veiculo',
      headerName: 'Veículo',
      flex: 1,
      valueGetter: (veiculo) => {
        if (veiculo && veiculo.id) {
          const { marca, modelo, placa } = veiculo;
          return `${marca} ${modelo} (Placa: ${placa})`;
        }

        return 'Nenhum';
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 1,
      renderCell: (params) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(ROUTES.MOTORISTA_EDIT.replace(':id', params.row.id))}
          >
            Atualizar
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => deleteMotorista(params.row.id)}
          >
            Deletar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Lista de Motoristas</h1>

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

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate(ROUTES.MOTORISTA_FORM)}
        >
          Novo Motorista
        </button>
      </div>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={motoristas}
          columns={columns}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
          rowCount={rowCount}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default MotoristaList;
