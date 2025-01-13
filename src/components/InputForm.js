import React, { useState } from 'react';
import InputMask from 'react-input-mask';

const InputForm = ({ value, label, mask, onChange, placeholder, desiredLength = 1, disabled, required, loading }) => {
  const [error, setError] = useState('');

  const validate = () => {
    if (value.replace(/[^0-9]/g, '').length < desiredLength) {
      setError(`O campo ${label} deve conter pelo menos ${desiredLength} dígitos. e este contém ${value.replace(/[^0-9]/g, '').length}`);
    } else {
      setError('');
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor={value} className="form-label">
        {label}
      </label>
      <InputMask
        id={value}
        mask={mask}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (error) setError('');
        }}
        placeholder={placeholder}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        required={required}
        disabled={disabled || loading}
        onBlur={validate}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputForm;
