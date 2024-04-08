import "./App.css";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import OpenAI from "openai";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MicIcon from "@mui/icons-material/Mic";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import logo from "./static/emojify_logo.png";
import CircularProgress from "@mui/material/CircularProgress";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [density, setDensity] = useState(20);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    setCharCount(inputText.length);
  }, [inputText]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const densityToPrompt = {
    0: "Use emojis very sparingly.",
    10: "Use emojis sparingly.",
    20: "",
    30: "Use emojis generously.",
    40: "Use an absurdly large amount of emojis.",
  };

  const handleEmojifyClick = async () => {
    if (inputText === "") {
      return;
    }
    setLoading(true);
    try {
      const messages = [
        {
          role: "system",
          content: "You help add emojies appropriately to text messages.",
        },
        {
          role: "user",
          content: `Given the following text message, add emojies appropriately throughout the text. Give me a json object of three possible variations with numbers as the json keys. Don't include any additional markups. Here's the message: "${inputText}"`,
        },
      ];
      if (density !== 20) {
        messages.push({ role: "user", content: densityToPrompt[density] });
      }
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      // output looks like { "1": "what's good gang 👋", "2": "what's good gang 🤙", "3": "what's good gang 💪" }
      let output = response.choices[0].message.content;
      console.log(output);
      output = Object.values(JSON.parse(output));
      setOutputText(output);
    } catch (error) {
      console.error("Error:", error);
      setOutputText([]);
    }
    setLoading(false);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const handleCloseCopy = (event, reason) => {
    if (reason === "clickaway") {
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

  const settingsOpen = Boolean(anchorEl);
  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSettingsClose = () => {
    setAnchorEl(null);
  };
  const marks = [
    {
      value: 0,
      label: "A Few",
    },
    {
      value: 20,
      label: "Default",
    },
    {
      value: 40,
      label: "A Lot",
    },
  ];

  const handleDensityChange = (event, newValue) => {
    setDensity(newValue);
  };

  return (
    <div>
      <img src={logo} alt="Emojify Logo" className="logo" />
      <div className="input-container">
        <Stack spacing={2} direction="row" alignItems="flex-start">
          <Tooltip
            title="Listening, click again when done!"
            arrow
            open={listening}
            disableFocusListener
            disableHoverListener
            disableTouchListener
          >
            <Box
              sx={{ m: 1, position: "relative" }}
              style={{ marginTop: "4px" }}
            >
              <Fab
                aria-label="listen"
                color="primary"
                onClick={handleMicClick}
                size={"medium"}
              >
                <MicIcon />
              </Fab>
              {listening && (
                <CircularProgress
                  size={56}
                  sx={{
                    position: "absolute",
                    top: -4,
                    left: -4,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          </Tooltip>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Text to emojify"
              variant="outlined"
              multiline
              inputProps={{ maxLength: 200, style: { maxWidth: "230px" } }}
              sx={{ minWidth: 300 }}
              value={inputText}
              onChange={handleInputChange}
              // enter to submit, shift+enter to linebreak
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleEmojifyClick();
                }
              }}
            />
            {charCount > 0 && (
              <p
                style={{
                  position: "absolute",
                  top: -35,
                  right: 0,
                  fontSize: "14px",
                  color: "gray",
                }}
              >
                {charCount}/200
              </p>
            )}
          </div>
          <div
            style={{
              marginTop: "8px",
              marginLeft: "-45px",
              marginRight: "5px",
            }}
          >
            <IconButton
              id="basic-button"
              aria-controls={settingsOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={settingsOpen ? "true" : undefined}
              onClick={handleSettingsClick}
            >
              <SettingsIcon />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={settingsOpen}
              onClose={handleSettingsClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <p
                style={{
                  marginBottom: "5px",
                  marginTop: "0px",
                  marginLeft: "10px",
                }}
              >
                Emoji quantity
              </p>
              <Box sx={{ width: 200, paddingX: "30px" }}>
                <Slider
                  aria-label="Density"
                  value={density}
                  onChange={handleDensityChange}
                  shiftStep={10}
                  step={10}
                  marks={marks}
                  min={0}
                  max={40}
                />
              </Box>
            </Menu>
          </div>
          <Button
            variant="contained"
            style={{ minWidth: "fit-content", marginTop: "9.75px" }}
            onClick={handleEmojifyClick}
          >
            Emojify
          </Button>
        </Stack>
      </div>
      {!browserSupportsSpeechRecognition && (
        <p style={{ fontStyle: "italic", textAlign: "center" }}>
          Please allow access to mic for speech-to-text functionality
        </p>
      )}
      {loading && (
        <div className="progress-container">
          <CircularProgress />
        </div>
      )}
      {outputText.length > 0 && !loading && (
        <div>
          <div className="output-container">
            <p>We think you might like these:</p>
            {outputText.map((text, index) => (
              <Stack
                key={index}
                spacing={2}
                direction="row"
                alignItems="center"
              >
                <p>{text}</p>
                <Tooltip title="Copy to Clipboard" placement="right">
                  <IconButton onClick={() => handleCopyToClipboard(text)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            ))}
          </div>
          <p style={{ fontStyle: "italic", textAlign: "center" }}>
            Not quite what you were looking for? Try clicking "Emojify" again!
          </p>
        </div>
      )}
      <p style={{ position: 'fixed', bottom: '10px', textAlign: 'center', width: '100%' }}>By Nathan Li & Edward Kang</p>
      <Snackbar
        open={copied}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={handleCloseCopy}
        message="Copied to clipboard!"
      />
    </div>
  );
}

export default App;
