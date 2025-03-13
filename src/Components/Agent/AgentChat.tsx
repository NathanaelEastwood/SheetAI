import React, { useState, useEffect } from 'react';
import { useAIAgent } from '../../Services/AIService';
import { useSelector } from 'react-redux';
import { RootState } from "../../main";
import { Button } from "../ui/button";
import { cn } from "../../Lib/Utils";


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
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium m-0">AI Agent</h4>
          <div className="flex gap-2">
            <Button 
              onClick={handleNewChat}
              variant="ghost" 
              size="sm"
            >
              New Chat
            </Button>
            <Button 
              onClick={() => setCurrentView(ChatView.SESSION_LIST)}
              variant="ghost"
              size="sm"
            >
              Chat History
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1 max-h-[300px]">
          {chatHistory.length === 0 ? (
            <p className="text-center text-gray-500">
              Start a new conversation
            </p>
          ) : (
            chatHistory.map((chat) => (
              <div key={chat.id} className="mb-4">
                <div className={cn(
                  "p-2 rounded-md mb-2",
                  darkModeState ? "bg-green-100" : "bg-green-900/30"
                )}>
                  <strong>You:</strong> {chat.message}
                </div>
                <div className={cn(
                  "p-2 rounded-md",
                  darkModeState ? "bg-blue-100" : "bg-blue-900/30"
                )}>
                  <strong>AI:</strong> {chat.response}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about your spreadsheet..."
            className={cn(
              "w-full p-2 mb-2 rounded-md border",
              darkModeState 
                ? "border-gray-300 bg-white text-gray-900" 
                : "border-gray-700 bg-gray-950 text-gray-100"
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            variant={darkModeState ? "default" : "secondary"}
          >
            {isLoading ? 'Thinking...' : 'Ask AI Agent'}
          </Button>
        </form>
      </div>
    </>
  );

  // Render the session list view
  const renderSessionList = () => (
    <>
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium m-0">Chat History</h4>
          <Button 
            onClick={handleBackToCurrentChat}
            variant="ghost"
            size="sm"
          >
            Back
          </Button>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1">
          {sessions.length === 0 ? (
            <p className="text-center text-gray-500">
              No chat sessions found
            </p>
          ) : (
            sessions.map((session) => (
              <div 
                key={session.id}
                onClick={() => handleViewSessionHistory(session.id)}
                className={cn(
                  "p-3 mb-2 rounded-md cursor-pointer transition-colors",
                  darkModeState ? "bg-gray-100 hover:bg-green-100" : "bg-gray-900 hover:bg-green-900/30"
                )}
              >
                <div className="font-medium">{session.session_name}</div>
                <div className="text-xs text-gray-500">
                  {new Date(session.updated_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );

  // Render the session history view
  const renderSessionHistory = () => (
    <>
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium m-0">
            {selectedHistorySessionId ? getSessionName(selectedHistorySessionId) : "Chat History"}
          </h4>
          <Button 
            onClick={handleBackToSessionList}
            variant="ghost"
            size="sm"
          >
            Back
          </Button>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1">
          {chatHistory.length === 0 ? (
            <p className="text-center text-gray-500">
              No messages in this chat session
            </p>
          ) : (
            chatHistory.map((chat) => (
              <div key={chat.id} className="mb-4">
                <div className={cn(
                  "p-2 rounded-md mb-2",
                  darkModeState ? "bg-green-100" : "bg-green-900/30"
                )}>
                  <strong>You:</strong> {chat.message}
                </div>
                <div className={cn(
                  "p-2 rounded-md",
                  darkModeState ? "bg-blue-100" : "bg-blue-900/30"
                )}>
                  <strong>AI:</strong> {chat.response}
                </div>
              </div>
            ))
          )}
        </div>
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
      minHeight: '200px',
      backgroundColor: darkModeState ? '#ffffff' : '#1a1a1a',
      color: darkModeState ? '#000000' : '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid',
      borderColor: darkModeState ? '#e2e8f0' : '#2d3748'
    }}>
      {currentView === ChatView.CURRENT_CHAT && renderCurrentChat()}
      {currentView === ChatView.SESSION_LIST && renderSessionList()}
      {currentView === ChatView.SESSION_HISTORY && renderSessionHistory()}
    </div>
  );
};

export default AgentChat; 