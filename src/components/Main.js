import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import ROUTES from '../routes';

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column vh-100">
      <header
        className="p-3 border-bottom bg-light d-flex align-items-center justify-content-between"
        style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <div>
          <button
            className="btn btn-link text-decoration-none fs-4 fw-bold"
            onClick={() => navigate(ROUTES.HOME)}
            style={{
              color: '#007bff',
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'none',
            }}
          >
            Home
          </button>
        </div>
      </header>
      <main
        className="flex-grow-1 d-flex flex-column align-items-center justify-content-top"
        style={{
          background: 'linear-gradient(to bottom right, #f9f9f9, #e9ecef)',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Main;
