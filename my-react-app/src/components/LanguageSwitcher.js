import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

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
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FormControl variant="filled" style={{ minWidth: 120, margin: 10 }}>
                <InputLabel id="select-language-from-label">Translate from</InputLabel>
                <Select
                    labelId="select-language-from-label"
                    id="select-language-from"
                    value={languageFrom}
                    onChange={handleLanguageFromChange}
                >
                    <MenuItem value="Text">Text</MenuItem>
                    <MenuItem value="Emojis">Emojis</MenuItem>
                </Select>
            </FormControl>

            <IconButton aria-label="swap" size="large">
                <SwapHorizIcon onClick={handleSwap}/>
            </IconButton>

            <FormControl variant="filled" style={{ minWidth: 120, margin: 10 }}>
                <InputLabel id="select-language-to-label">Translate to</InputLabel>
                <Select
                    labelId="select-language-to-label"
                    id="select-language-to"
                    value={languageTo}
                    onChange={handleLanguageToChange}
                >
                    <MenuItem value="Text">Text</MenuItem>
                    <MenuItem value="Emojis">Emojis</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}