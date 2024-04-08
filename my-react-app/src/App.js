import './App.css';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import OpenAI from "openai";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MicIcon from '@mui/icons-material/Mic';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import logo from './static/emojify_logo.png';
import CircularProgress from '@mui/material/CircularProgress';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // can use ctrl + enter to trigger emojify
  useEffect(() => {
    setCharCount(inputText.length);
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
        { "role": "user", "content": `Given the following text message, add emojies appropriately throughout the text. Give me a json object of three possible variations with numbers as the json keys. Here's the message: "${inputText}"` }],
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

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setInputText(transcript);
      console.log(inputText);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  return (
    <div>
      <img src={logo} alt="Emojify Logo" className='logo' />
      <div className="input-container">
        <Stack spacing={2} direction="row" alignItems="center">
          <Box sx={{ m: 1, position: 'relative' }}>
            <Fab
              aria-label="listen"
              color="primary"
              onClick={handleMicClick}
              size={'medium'}
            >
              <MicIcon />
            </Fab>
            {listening && (
              <CircularProgress
                size={56}
                sx={{
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  zIndex: 1,
                }}
              />
            )}
          </Box>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <TextField
              id="outlined-basic"
              label="Text to emojify"
              variant="outlined"
              multiline
              inputProps={{ maxLength: 200 }}
              sx={{ minWidth: 300 }}
              value={inputText}
              onChange={handleInputChange}
            />
            {charCount > 0 && (
              <p style={{ position: 'absolute', top: -35, right: 0, fontSize: '14px', color: 'gray' }}>{charCount}/200</p>
            )}
          </div>
          <Button variant="contained" style={{ minWidth: 'fit-content' }} onClick={handleButtonClick}>
            Emojify
          </Button>
        </Stack>
      </div>
      {!browserSupportsSpeechRecognition && (
        <p style={{ fontStyle: 'italic', textAlign: 'center' }}>Please allow access to mic for speech-to-text functionality</p>
      )}
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
