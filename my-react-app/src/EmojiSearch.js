import styles from "./EmojiSearch.module.css";
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import OpenAI from "openai";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MicIcon from "@mui/icons-material/Mic";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import logo from "./static/search_logo.png";
import CircularProgress from "@mui/material/CircularProgress";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function EmojifySearch() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [tooLong, setTooLong] = useState(false);

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

  const handleSearch = async () => {
    if (inputText === "") {
      return;
    }
    setLoading(true);
    try {
      const messages = [
        {
          role: "system",
          content:
            "The user gives a description of an emoji they're trying to find, and you help provide possible answers.",
        },
        {
          role: "user",
          content: `Given the following emoji description, figure out what emoji it is. Give me a json object of three possible emojis. Let numbers be the json keys, and the two values "emoji" and "name" be the emoji itself and the name of the emoji, respectively. Don't include any additional markups. Here's the message: "${inputText}"`,
        },
      ];
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      // output looks like {"1": {"emoji": "🐶","name": "Dog Face"},"2":..."
      let output = response.choices[0].message.content;
      console.log(output);
      output = Object.values(JSON.parse(output));
      console.log(output);
      setOutputText(output);
    } catch (error) {
      console.error("Error:", error);
      setOutputText([-1]);
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

  const handleCloseTooLong = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setTooLong(false);
  };

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript.length > 200) {
        setTooLong(true);
        return;
      }
      setInputText(transcript);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  return (
    <div>
      <img src={logo} alt="Emojify Logo" className={styles.logo} />
      <div className={styles.input_container}>
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
              label="Describe the emoji"
              variant="outlined"
              multiline
              inputProps={{ maxLength: 200 }}
              sx={{ minWidth: 300 }}
              value={inputText}
              onChange={handleInputChange}
              // enter to submit, shift+enter to linebreak
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSearch();
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
          <Button
            variant="contained"
            style={{ minWidth: "fit-content", marginTop: "9.75px" }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Stack>
      </div>
      {!browserSupportsSpeechRecognition && (
        <p style={{ fontStyle: "italic", textAlign: "center" }}>
          Please allow access to mic for speech-to-text functionality
        </p>
      )}
      {loading && (
        <div className={styles.progress_container}>
          <CircularProgress />
        </div>
      )}
      {outputText[0] === -1 && !loading && (
        <p style={{ fontStyle: "italic", textAlign: "center" }}>
          Ack! Something went wrong. Try searching again!
        </p>
      )}
      {outputText.length > 0 && outputText[0] !== -1 && !loading && (
        <div>
          <div className={styles.output_container}>
            <p>We think you might be looking for these:</p>
            {outputText.map((textObject, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  maxWidth: "900px",
                  margin: "0 auto",
                }}
              >
                <div style={{ display: "inline-block" }}>
                  <Tooltip title={textObject.name} placement="left">
                    <IconButton>
                        <InfoOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </div>
                <p style={{ wordWrap: "break-word", flex: "1" }}>
                  {textObject.emoji}
                </p>
                <div style={{ display: "inline-block" }}>
                  <Tooltip title="Copy to Clipboard" placement="right">
                    <IconButton
                      onClick={() => handleCopyToClipboard(textObject.emoji)}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontStyle: "italic", textAlign: "center" }}>
            Not quite what you were looking for? Try clicking search again!
          </p>
        </div>
      )}
      <Snackbar
        open={copied}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={handleCloseCopy}
        message="Copied to clipboard!"
      />
      <Snackbar
        open={tooLong}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={4000}
        onClose={handleCloseTooLong}
        message="Message too long, try again!"
      />
    </div>
  );
}

export default EmojifySearch;
