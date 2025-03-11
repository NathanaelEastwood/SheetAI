import React, { useState, useEffect } from 'react';
import { useAIAgent } from '../../Services/AIService';
import { useSelector } from 'react-redux';
import {RootState} from "../../main";

interface AIChatProps {}

const AgentChat: React.FC<AIChatProps> = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { queryAI } = useAIAgent();
  const darkModeState: boolean = useSelector((state: RootState) => state.globalDarkMode);

  useEffect(() => {
    console.log('AgentChat component mounted');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const result = await queryAI(query);
      setResponse(result);
    } catch (error) {
      setResponse('Error: Failed to get response from AI');
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '300px',
      padding: '15px',
      backgroundColor: darkModeState ? '#f8f9fa' : '#070605',
      color: darkModeState ? '#212529' : '#dedad6',
      borderRadius: '8px',
      boxShadow: darkModeState ? '0 2px 10px rgba(0,0,0,0.1)' : '0 2px 10px rgba(255,255,255,0.1)',
      zIndex: 1000
    }}>
      <h4 style={{ marginBottom: '10px' }}>AI Assistant</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about your spreadsheet..."
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '4px',
            border: darkModeState ? '1px solid #ced4da' : '1px solid #312b25',
            backgroundColor: darkModeState ? '#ffffff' : '#000000',
            color: darkModeState ? '#212529' : '#dedad6',
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: darkModeState ? '#2c5282' : '#d3ad7d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? 'Thinking...' : 'Ask AI'}
        </button>
      </form>
      {response && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: darkModeState ? '#e9ecef' : '#161310',
          borderRadius: '4px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {response}
        </div>
      )}
    </div>
  );
};

export default AgentChat; 