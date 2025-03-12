import React, { useState, useEffect } from 'react';
import { useAIAgent } from '../../Services/AIService';
import { useSelector } from 'react-redux';
import { RootState } from "../../main";
import { supabase } from '../../Auth';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  created_at: string;
  session_id?: string;
}

interface ChatSession {
  id: string;
  user_id: string;
  session_name: string;
  created_at: string;
  updated_at: string;
}

// View states for the chat interface
enum ChatView {
  CURRENT_CHAT,    
  SESSION_LIST,    
  SESSION_HISTORY  
}

const AgentChat: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedHistorySessionId, setSelectedHistorySessionId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ChatView>(ChatView.CURRENT_CHAT);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { queryAI, getChatHistory, createNewSession, getUserSessions, updateSessionName } = useAIAgent();
  const darkModeState: boolean = useSelector((state: RootState) => state.globalDarkMode);

  // Load user sessions when component mounts
  useEffect(() => {
    loadUserSessions();
  }, []);

  // Load chat history when current session changes
  useEffect(() => {
    if (currentSessionId) {
      loadChatHistory(currentSessionId);
    } else {
      setChatHistory([]);
    }
  }, [currentSessionId]);

  const loadUserSessions = async () => {
    try {
      const userSessions = await getUserSessions();
      
      // Filter out sessions with no messages
      const nonEmptySessions = await Promise.all(
        userSessions.map(async (session) => {
          const history = await getChatHistory(session.id);
          return { session, hasMessages: history.length > 0 };
        })
      );
      
      const filteredSessions = nonEmptySessions
        .filter(item => item.hasMessages)
        .map(item => item.session);
      
      setSessions(filteredSessions);
      
      // If there are sessions, set the most recent one as current
      if (filteredSessions.length > 0) {
        setCurrentSessionId(filteredSessions[0].id);
      } else {
        // Don't create a new session automatically
        setCurrentSessionId(null);
      }
    } catch (error) {
      console.error('Error loading user sessions:', error);
    }
  };

  // Fetches and sets chat history for a specific session
  const loadChatHistory = async (sessionId: string | null) => {
    if (!sessionId) {
      setChatHistory([]);
      return;
    }
    
    try {
      const history = await getChatHistory(sessionId);
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Creates a new chat session and resets the UI
  const handleNewChat = async () => {
    try {
      const newSessionId = await createNewSession("New Chat");
      if (newSessionId) {
        setCurrentSessionId(newSessionId);
        setChatHistory([]);
        setResponse('');
        setCurrentView(ChatView.CURRENT_CHAT);

      }
    } catch (error) {
      console.error('Error creating new session:', error);
    }
  };

  // Switches to view a specific session's chat history
  const handleViewSessionHistory = (sessionId: string) => {
    setSelectedHistorySessionId(sessionId);
    loadChatHistory(sessionId);
    setCurrentView(ChatView.SESSION_HISTORY);
  };

  // Returns to the list of all sessions
  const handleBackToSessionList = () => {
    setCurrentView(ChatView.SESSION_LIST);
  };

  // Returns to the current active chat
  const handleBackToCurrentChat = () => {
    setCurrentView(ChatView.CURRENT_CHAT);
    if (currentSessionId) {
      loadChatHistory(currentSessionId);
    }
  };

  // Handles form submission to send a query to the agent
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // If no current session, create one before sending the query
      let sessionId = currentSessionId;
      let isNewSession = false;
      
      if (!sessionId) {
        // Create with temporary name - we'll update it after
        sessionId = await createNewSession("New Chat");
        setCurrentSessionId(sessionId);
        isNewSession = true;
      }

      if (sessionId) {
        const result = await queryAI(query, sessionId);
        setResponse(result);
        
        // If this is a new session, update its name to the first prompt
        if (isNewSession) {
          // Truncate long queries for the session name
          const sessionName = query.length > 50 ? query.substring(0, 47) + '...' : query;
          await updateSessionName(sessionId, sessionName);
        }
        
        // After getting a response, update the chat history
        await loadChatHistory(sessionId);
        
        // Also refresh the sessions list to show the new session with updated name
        await loadUserSessions();
        
        setQuery('');
      } else {
        setResponse('Error: Failed to create or retrieve chat session');
      }
    } catch (error) {
      setResponse('Error: Failed to get response from AI');
      console.error(error);
    }
    setIsLoading(false);
  };

  // Find session name by ID
  const getSessionName = (sessionId: string) => {
    return sessions.find(s => s.id === sessionId)?.session_name || "Chat";
  };

  // Render the current chat view
  const renderCurrentChat = () => (
    <>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '10px' 
      }}>
        <h4 style={{ margin: 0 }}>AI Agent</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleNewChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              color: darkModeState ? '#212529' : '#dedad6',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '4px 8px'
            }}
          >
            New Chat
          </button>
          <button 
            onClick={() => setCurrentView(ChatView.SESSION_LIST)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'none',
              border: 'none',
              color: darkModeState ? '#212529' : '#dedad6',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '4px 8px'
            }}
          >
            <span>Chat History</span>
          </button>
        </div>
      </div>
      
      {/* Chat history */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '10px',
        maxHeight: '300px'
      }}>
        {chatHistory.length === 0 ? (
          <p style={{ textAlign: 'center', color: darkModeState ? '#6c757d' : '#9a9a9a' }}>
            Start a new conversation
          </p>
        ) : (
          chatHistory.map((chat) => (
            <div key={chat.id} style={{ marginBottom: '15px' }}>
              <div style={{ 
                backgroundColor: darkModeState ? '#d1e7dd' : '#0f3a2d', 
                padding: '8px', 
                borderRadius: '4px',
                marginBottom: '5px'
              }}>
                <strong>You:</strong> {chat.message}
              </div>
              <div style={{ 
                backgroundColor: darkModeState ? '#cfe2ff' : '#0a2a4d', 
                padding: '8px', 
                borderRadius: '4px' 
              }}>
                <strong>AI:</strong> {chat.response}
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} style={{ marginTop: 'auto' }}>
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
          {isLoading ? 'Thinking...' : 'Ask AI Agent'}
        </button>
      </form>
    </>
  );

  // Render the session list view
  const renderSessionList = () => (
    <>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px' 
      }}>
        <h4 style={{ margin: 0 }}>Chat History</h4>
        <button 
          onClick={handleBackToCurrentChat}
          style={{
            background: 'none',
            border: 'none',
            color: darkModeState ? '#212529' : '#dedad6',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '4px 8px'
          }}
        >
          Back
        </button>
      </div>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '10px'
      }}>
        {sessions.length === 0 ? (
          <p style={{ textAlign: 'center', color: darkModeState ? '#6c757d' : '#9a9a9a' }}>
            No chat sessions found
          </p>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => handleViewSessionHistory(session.id)}
              style={{
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: darkModeState ? '#e9ecef' : '#161310',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkModeState ? '#d1e7dd' : '#0f3a2d';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = darkModeState ? '#e9ecef' : '#161310';
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{session.session_name}</div>
              <div style={{ fontSize: '12px', color: darkModeState ? '#6c757d' : '#9a9a9a' }}>
                {new Date(session.updated_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  // Render the session history view
  const renderSessionHistory = () => (
    <>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px' 
      }}>
        <h4 style={{ margin: 0 }}>
          {selectedHistorySessionId ? getSessionName(selectedHistorySessionId) : "Chat History"}
        </h4>
        <button 
          onClick={handleBackToSessionList}
          style={{
            background: 'none',
            border: 'none',
            color: darkModeState ? '#212529' : '#dedad6',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '4px 8px'
          }}
        >
          Back
        </button>
      </div>
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '10px'
      }}>
        {chatHistory.length === 0 ? (
          <p style={{ textAlign: 'center', color: darkModeState ? '#6c757d' : '#9a9a9a' }}>
            No messages in this chat session
          </p>
        ) : (
          chatHistory.map((chat) => (
            <div key={chat.id} style={{ marginBottom: '15px' }}>
              <div style={{ 
                backgroundColor: darkModeState ? '#d1e7dd' : '#0f3a2d', 
                padding: '8px', 
                borderRadius: '4px',
                marginBottom: '5px'
              }}>
                <strong>You:</strong> {chat.message}
              </div>
              <div style={{ 
                backgroundColor: darkModeState ? '#cfe2ff' : '#0a2a4d', 
                padding: '8px', 
                borderRadius: '4px' 
              }}>
                <strong>AI:</strong> {chat.response}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: currentView !== ChatView.CURRENT_CHAT ? '400px' : '300px',
      height: currentView !== ChatView.CURRENT_CHAT ? '500px' : 'auto',
      padding: '15px',
      backgroundColor: darkModeState ? '#f8f9fa' : '#070605',
      color: darkModeState ? '#212529' : '#dedad6',
      borderRadius: '8px',
      boxShadow: darkModeState ? '0 2px 10px rgba(0,0,0,0.1)' : '0 2px 10px rgba(255,255,255,0.1)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s, height 0.3s'
    }}>
      {currentView === ChatView.CURRENT_CHAT && renderCurrentChat()}
      {currentView === ChatView.SESSION_LIST && renderSessionList()}
      {currentView === ChatView.SESSION_HISTORY && renderSessionHistory()}
    </div>
  );
};

export default AgentChat; 