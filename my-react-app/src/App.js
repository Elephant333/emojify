import './App.css';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = async () => {
    if (inputText == "") {
      return
    }
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": "You help add emojies appropriately to text messages."},
        {"role": "user", "content": `Given the following text message, add emojies appropriately throughout the text and don't add anything else: "${inputText}"`}],
      });

      setOutputText(response.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      setOutputText('Failed to generate emojis');
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
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
      <Button variant="outlined" onClick={handleCopyToClipboard} disabled={!outputText}>
        Copy to Clipboard
      </Button>
    </div>
  );
}

export default App;
