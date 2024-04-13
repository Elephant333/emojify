import styles from "./EmojiAnalysis.module.css";
import React, { useState, useEffect } from "react";
import logo from "./static/analyzer_logo.png";
import monkey from "./static/monkey.gif";

function EmojiAnalysis() {
  return (
    <div>
      <img src={logo} alt="Emojify Logo" className={styles.logo} />
      <div className={styles.input_container}>
        <p style={{ textAlign: "center" }}>
          Oopsie daisy! Our code monkeys 🐒 are working very hard to finish this
          feature 🔨
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={monkey} alt="Monkey" style={{ maxWidth: "400px" }} />
        </div>
      </div>
    </div>
  );
}

export default EmojiAnalysis;
