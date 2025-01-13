import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import API from '../../services/api';
import ROUTES from '../../routes';

const VeiculoList = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVeiculos();
  }, [paginationModel]);

  const fetchVeiculos = async () => {
    setLoading(true);
    try {
      const { page, pageSize } = paginationModel;
      const response = await API.get('/veiculo', {
        params: { page: page + 1, pageSize },
      });
      setVeiculos(response.data.data);
      setRowCount(response.data.total);
    } catch (error) {
      console.error('Erro ao retornar veiculos:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar veiculos. Por favor, tente novamente.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteVeiculo = async (id) => {
    setLoading(true);
    try {
      await API.delete(`/veiculo/${id}`);
      setSnackbar({
        open: true,
        message: 'Veiculo deletado com sucesso!',
        severity: 'success',
      });
      fetchVeiculos();
    } catch (error) {
      console.error('Erro ao deletar veiculo:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao deletar veiculo. Por favor, tente novamente.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      fetchVeiculos();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: 'placa', headerName: 'Placa', flex: 1 },
    { field: 'marca', headerName: 'Marca', flex: 1 },
    { field: 'modelo', headerName: 'Modelo', flex: 1 },
    { field: 'renavam', headerName: 'Renavam', flex: 1 },
    { field: 'ano', headerName: 'Ano', flex: 1 },
    { field: 'Cor', headerName: 'cor', flex: 1 },
    {
      field: 'available',
      headerName: 'Designado',
      flex: 1,
      valueGetter: (veiculo) => (veiculo.available ? 'Sim' : 'Não'),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 1,
      renderCell: (veiculo) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(ROUTES.VEICULO_EDIT.replace(':id', veiculo.id))}
          >
            Atualizar
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => deleteVeiculo(veiculo.id)}
          >
            Deletar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Lista de Veiculos</h1>

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
        <button className="btn btn-primary" onClick={() => navigate(ROUTES.VEICULO_FORM)}>
          Novo Veiculo
        </button>
      </div>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={veiculos}
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

export default VeiculoList;
