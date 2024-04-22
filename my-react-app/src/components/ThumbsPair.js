import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import Tooltip from "@mui/material/Tooltip";

const ThumbsPair = () => {
  const [isThumbsUp, setIsThumbsUp] = useState(false);
  const [isThumbsDown, setIsThumbsDown] = useState(false);

  const handleThumbsUp = () => {
    setIsThumbsUp(!isThumbsUp);
    // If thumbs up is selected, thumbs down is turned off
    if (isThumbsDown) setIsThumbsDown(false);
  };

  const handleThumbsDown = () => {
    setIsThumbsDown(!isThumbsDown);
    // If thumbs down is selected, thumbs up is turned off
    if (isThumbsUp) setIsThumbsUp(false);
  };

  return (
    <div style = {{ display: "inline-block" }}>
        <Tooltip title="Good response" placement="right">
            <IconButton onClick={handleThumbsUp} color="primary">
                {isThumbsUp ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon/>}
            </IconButton>
        </Tooltip>
        <Tooltip title="Bad response" placement="right">
            <IconButton onClick={handleThumbsDown} color="secondary">
                {isThumbsDown ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
            </IconButton>
        </Tooltip>
    </div>
  );
};

export default ThumbsPair;
