import React from "react";

import TextField from "@material-ui/core/TextField";

type ILabeledInputComponent = {
  label: string;
  value: string;

  error?: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
};

const LabeledInputComponent = ({
  label,
  value,

  error,
  autoFocus,
  onChange,
}: ILabeledInputComponent) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="labeled-input">
      <TextField
        error={error !== undefined && error.length > 1}
        id={error ? "outlined-error-helper-text" : "outlined-basic"}
        variant="outlined"
        label={label}
        value={value}
        onChange={handleChange}
        helperText={error || ""}
        autoFocus={autoFocus}
        fullWidth
      />
    </div>
  );
};

export default LabeledInputComponent;