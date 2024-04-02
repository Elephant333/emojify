import './App.css';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import OpenAI from "openai";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = async () => {
    if (inputText === "") {
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
    setCopied(true);
  };

  const handleCloseCopy = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setCopied(false);
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
      <IconButton onClick={handleCopyToClipboard} disabled={!outputText}>
        <ContentCopyIcon />
      </IconButton>
      <Snackbar
        open={copied}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={handleCloseCopy}
        message="Copied to clipboard!"
      />
    </div>
  );
}

export default App;
