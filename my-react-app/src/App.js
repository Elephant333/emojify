import './App.css';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = () => {
    setOutputText(inputText);
  };

  return (
    <div className="center-container">
      <Stack spacing={2} direction="row" alignItems="center">
        <TextField
          id="outlined-basic"
          label="Text to emojify"
          variant="outlined"
          multiline
          sx={{ minWidth: 200 }}
          value={inputText}
          onChange={handleInputChange}
        />
        <Button variant="contained" style={{ minWidth: 'fit-content' }} onClick={handleButtonClick}>
          Emojify
        </Button>
      </Stack>
      <p>{outputText}</p>
    </div>
  );
}

export default App;
