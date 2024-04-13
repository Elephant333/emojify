import "./App.css";
import Emojify from "./Emojify";
import EmojiAnalysis from "./EmojiAnalysis";
import EmojiSearch from "./EmojiSearch";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function App() {
  const [tab, setTab] = React.useState(1);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <div>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Emoji Search" />
          <Tab label="Emojify" />
          <Tab label="Emoji Analyzer" />
        </Tabs>
      </Box>
      {tab === 0 && (
        <EmojiSearch />
      )}
      {tab === 1 && (
        <Emojify />
      )}
      {tab === 2 && (
        <EmojiAnalysis />
      )}
      <p
        style={{
          position: "fixed",
          bottom: "10px",
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
