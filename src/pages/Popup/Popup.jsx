import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    chrome.storage.local.get(['openai_api_key'], (result) => {
      console.log('Retrieved API Key from storage:', result.openai_api_key); // Debugging line
      if (result.openai_api_key) {
        setApiKey(result.openai_api_key);
      }
    });
  }, []);

  const handleInputChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleSave = () => {
    chrome.storage.local.set({ openai_api_key: apiKey }, () => {
      console.log('API Key saved in storage:', apiKey);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Settings</h1>
        <label htmlFor="api-key-input">OpenAI API Key:</label>
        <input
          type="text"
          id="api-key-input"
          value={apiKey}
          onChange={handleInputChange}
          placeholder="Enter your OpenAI API Key"
        />
        <button onClick={handleSave}>Save API Key</button>
      </header>
    </div>
  );
};

export default Popup;
