import React, { useState } from 'react';
import MaskedInput from 'react-text-mask';
import InputForm from './InputForm';

const InputFormRegex = ({ value, label, mask, onChange, placeholder, desiredLength = 1, disabled, required, loading }) => {
  const [error, setError] = useState('');

  const validate = () => {
    if (value.length < desiredLength) {
      setError(`O campo ${label} deve conter pelo menos ${desiredLength} dígitos.`);
    } else {
      setError('');
    }
  };

  return mask ? (
    <div className="mb-3">
      <label htmlFor={value} className="form-label">
        {label}
      </label>
      <MaskedInput
        mask={mask}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        disabled={disabled || loading}
        onBlur={validate}
        required={required}
        guide={false}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  ) : (
    <div className="mb-3">
      <label htmlFor={value} className="form-label">
        {label}
      </label>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`form-control ${error ? 'is-invalid' : ''}`}
      disabled={disabled || loading}
      onBlur={validate}
      required={required}
    />
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
  );
};

export default InputFormRegex;
