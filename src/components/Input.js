import React from 'react';
import MaskedInput from 'react-text-mask';

const Input = ({ value, placeholder, mask, onChange, disabled }) => {
  return mask ? (
    <MaskedInput
      mask={mask}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="form-control"
      disabled={disabled}
      guide={false}
    />
  ) : (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="form-control"
      disabled={disabled}
    />
  );
};

export default Input;
