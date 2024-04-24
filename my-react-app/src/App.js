import "./App.css";
import Emojify from "./Emojify";
import EmojiAnalysis from "./EmojiAnalysis";
import EmojiSearch from "./EmojiSearch";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import EmojifyTranslate from "./EmojifyTranslate";
function App() {
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <div>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Emojify" />
          <Tab label="Emoji Search" />
          <Tab label="Emoji Analyzer" />
          <Tab label="Emoji Translate" />
        </Tabs>
      </Box>
      {tab === 0 && (
        <Emojify />
      )}
      {tab === 1 && (
        <EmojiSearch />
      )}
      {tab === 2 && (
        <EmojiAnalysis />
      )}
      {tab === 3 && (
        <EmojifyTranslate />
      )}
      <p
        style={{
          position: "fixed",
          bottom: "0px",
          textAlign: "center",
          width: "100%",
        }}
      >
        By Nathan Li & Edward Kang
      </p>
    </div>
  );
}

export default App;
