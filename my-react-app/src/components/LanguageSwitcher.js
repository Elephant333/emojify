import React from "react";
import { MenuItem, Box, TextField, IconButton } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

export default function LanguageSwitcher(props) {
  const { languageFrom, setLanguageFrom, languageTo, setLanguageTo } = props;

  const handleLanguageFromChange = (event) => {
    let language = languageFrom;
    setLanguageFrom(event.target.value);
    setLanguageTo(language);
  };

  const handleLanguageToChange = (event) => {
    let language = languageTo;
    setLanguageFrom(language);
    setLanguageTo(event.target.value);
  };

  const handleSwap = () => {
    let language = languageFrom;
    setLanguageFrom(languageTo);
    setLanguageTo(language);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <TextField
        select
        label="Translate from"
        value={languageFrom}
        onChange={handleLanguageFromChange}
        size="small"
        variant="outlined"
        style={{ width: 110, margin: 10 }}
      >
        <MenuItem value="Text">Text</MenuItem>
        <MenuItem value="Emojis">Emojis</MenuItem>
      </TextField>

      <IconButton aria-label="swap" size="large" onClick={handleSwap}>
        <SwapHorizIcon />
      </IconButton>

      <TextField
        select
        label="Translate to"
        value={languageTo}
        onChange={handleLanguageToChange}
        size="small"
        variant="outlined"
        style={{ width: 110, margin: 10 }}
      >
        <MenuItem value="Text">Text</MenuItem>
        <MenuItem value="Emojis">Emojis</MenuItem>
      </TextField>
    </Box>
  );
}
