import React from "react";
import { TextField, IconButton } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

export default function LanguageSwitcher(props) {
  const { languageFrom, setLanguageFrom, languageTo, setLanguageTo } = props;

  const handleSwap = () => {
    let language = languageFrom;
    setLanguageFrom(languageTo);
    setLanguageTo(language);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TextField
        id="language-from"
        label="Translate from"
        variant="outlined"
        style={{ width: 110, margin: 10 }}
        size="small"
        value={languageFrom}
        InputProps={{
          readOnly: true,
        }}
      />

      <IconButton
        aria-label="swap"
        size="large"
        onClick={handleSwap}
        color="primary"
      >
        <SwapHorizIcon />
      </IconButton>

      <TextField
        id="language-to"
        label="Translate to"
        variant="outlined"
        style={{ width: 110, margin: 10 }}
        size="small"
        value={languageTo}
        InputProps={{
          readOnly: true,
        }}
      />
    </div>
  );
}
