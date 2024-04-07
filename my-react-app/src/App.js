import './App.css';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import OpenAI from "openai";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import logo from './static/emojify_logo.png';
import CircularProgress from '@mui/material/CircularProgress';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // can use ctrl + enter to trigger emojify
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        handleButtonClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputText]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = async () => {
    if (inputText === "") {
      return
    }
    setLoading(true);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ "role": "system", "content": "You help add emojies appropriately to text messages." },
        { "role": "user", "content": `Given the following text message, add emojies appropriately throughout the text. Give me a json object of three possible variations with numbers as the json keys: "${inputText}"` }],
      });

      // output looks like { "1": "what's good gang 👋", "2": "what's good gang 🤙", "3": "what's good gang 💪" }
      let output = response.choices[0].message.content;
      console.log(output);
      output = Object.values(JSON.parse(output));
      setOutputText(output);
    } catch (error) {
      console.error('Error:', error);
      setOutputText([]);
    }
    setLoading(false);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const handleCloseCopy = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setCopied(false);
  };

  return (
    <div>
      <img src={logo} alt="Emojify Logo" className='logo' />
      <div className="input-container">
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
      </div>
      {loading && (
        <div className="progress-container">
          <CircularProgress />
        </div>
      )}
      {outputText.length > 0 && !loading && (
        <div className="output-container">
          <p>We think you might like these:</p>
          {outputText.map((text, index) => (
            <Stack key={index} spacing={2} direction="row" alignItems="center">
              <p>{text}</p>
              <IconButton onClick={() => handleCopyToClipboard(text)}>
                <ContentCopyIcon />
              </IconButton>
            </Stack>
          ))}
        </div>
      )}
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
