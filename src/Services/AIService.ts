import TableData from "../Entities/Table/TableData";
import { useSelector } from "react-redux";
import { RootState } from "../main";
import { supabase } from "../Auth";

// API URL
const API_URL = "http://localhost:5000/agent"; 

// Gather the context of the spreadsheet    
interface SpreadsheetContext {
    tableData: TableData;
    selectedCell: [number, number];
    selectedRange?: {
        start: [number, number];
        end: [number, number];
    };
}

// Interface for chat messages
interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  response: string;
  created_at: string;
}

// Interface for chat sessions  
interface ChatSession {
  id: string;
  user_id: string;
  session_name: string;
  created_at: string;
  updated_at: string;
}

export class AIService {
    constructor() {
    }
    
    // Query the spreadsheet    
    async querySpreadsheet(
      query: string, 
      context: SpreadsheetContext,
      userId?: string 
    ): Promise<string> {
      try {
        // Convert the TableData to a more readable format for the Agent
        const cellData = this.formatTableDataForAgent(context.tableData, context.selectedCell, context.selectedRange);
        
        // Create the request payload
        const requestPayload = {
          query: query,
          selection: this.formatCellReference(context.selectedCell),
          selectedRange: context.selectedRange ? 
            `${this.formatCellReference(context.selectedRange.start)} to ${this.formatCellReference(context.selectedRange.end)}` 
            : null,
          spreadsheetData: cellData
        };
        
        // Send request to backend server
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        });
        
        const result = await response.json();
        const aiResponse = result.choices[0].message.content || "No response generated";
        
        // Save chat history if userId is provided
        if (userId) {
          await this.saveChatHistory(userId, query, aiResponse);
        }
        
        return aiResponse;
      } catch (error) {
        console.error('Error querying AI service:', error);
        throw error;
      }
    }

    // Save chat history
    async saveChatHistory(userId: string, message: string, response: string, sessionId?: string): Promise<void> {
      try {
        const { error } = await supabase
          .from('chat_history')
          .insert([
            sessionId 
              ? { user_id: userId, message, response, session_id: sessionId }
              : { user_id: userId, message, response }
          ]);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }

    // Fetch chat history
    async getChatHistory(userId: string, sessionId: string): Promise<ChatMessage[]> {
      try {
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', userId)
          .eq('session_id', sessionId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data as ChatMessage[];
      } catch (error) {
        console.error('Error fetching chat history:', error);
        return [];
      }
    }

    private formatTableDataForAgent(
      tableData: TableData, 
      selectedCell: [number, number],
      selectedRange?: { start: [number, number]; end: [number, number] }
    ): string {
      let relevantData: { position: string; value: string; formula?: string }[] = [];
      
      // If there's a selected range, format all cells in that range
      if (selectedRange) {
        const [startCol, startRow] = selectedRange.start;
        const [endCol, endRow] = selectedRange.end;
        
        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
          for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            const cell = tableData.getCellValue(col, row);
            relevantData.push({
              position: this.formatCellReference([col, row]),
              value: cell.RenderedValue,
              formula: cell.UnderlyingValue.startsWith('=') ? cell.UnderlyingValue : undefined
            });
          }
        }
      } else {
        // Otherwise, just format the selected cell and its immediate surroundings in a 5x5 grid to help the Agent understand the context   
        const [col, row] = selectedCell;
        for (let r = Math.max(0, row - 2); r <= row + 2; r++) {
          for (let c = Math.max(0, col - 2); c <= col + 2; c++) {
            if (tableData.data[r] && tableData.data[r][c]) {
              const cell = tableData.getCellValue(c, r);
              relevantData.push({
                position: this.formatCellReference([c, r]),
                value: cell.RenderedValue,
                formula: cell.UnderlyingValue.startsWith('=') ? cell.UnderlyingValue : undefined
              });
            }
          }
        }
      }

      return JSON.stringify(relevantData, null, 2);
    }

    private formatCellReference([col, row]: [number, number]): string {
      // Using your existing helper function if available, or implement column to letter conversion i.e 0,0 -> A1
      return `${this.getLetterFromNumber(col)}${row + 1}`;
    }

    private getLetterFromNumber(num: number): string {
      // Using your existing getLetterFromNumber helper function it converts a number to a letter i.e 0 -> A, 1 -> B etc
      let letter = '';
      num = num + 1;
      
      while (num > 0) {
        num--;
        letter = String.fromCharCode(65 + (num % 26)) + letter;
        num = Math.floor(num / 26);
      }
      
      return letter;
    }

    // Add methods to AIService class
    async createNewSession(userId: string, sessionName: string = "New Chat"): Promise<string | null> {
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .insert([
            { user_id: userId, session_name: sessionName }
          ])
          .select();
          
        if (error) throw error;
        return data?.[0]?.id || null;
      } catch (error) {
        console.error('Error creating new chat session:', error);
        return null;
      }
    }

    async getUserSessions(userId: string): Promise<ChatSession[]> {
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        return data as ChatSession[];
      } catch (error) {
        console.error('Error fetching user sessions:', error);
        return [];
      }
    }

    async updateSessionName(sessionId: string, newName: string): Promise<boolean> {
      try {
        const { error } = await supabase
          .from('chat_sessions')
          .update({ session_name: newName })
          .eq('id', sessionId);
          
        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Error updating session name:', error);
        return false;
      }
    }
}

// Hook that provides agent
export const useAIAgent = () => {
  const tableData = useSelector((state: RootState) => state.globalTableData.value);
  const selectedCell = useSelector((state: RootState) => state.globalTableData.selectedCell);
  
  // Create AI service instance
  const aiService = new AIService();
  
  // Creates a new chat session
  const createNewSession = async (sessionName?: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) return null;
    return await aiService.createNewSession(userId, sessionName);
  };
  
  // Gets all chat sessions for the current user
  const getUserSessions = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) return [];
    return await aiService.getUserSessions(userId);
  };
  
  // Sends a query to the agent and saves the interaction
  const queryAI = async (query: string, sessionId: string, selectedRange?: { start: [number, number]; end: [number, number] }) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // Prepare context with current spreadsheet state
    const context = {
      tableData,
      selectedCell: selectedCell as [number, number],
      selectedRange
    };

    const response = await aiService.querySpreadsheet(query, context, userId);
    
    // Save to chat history if user is logged in
    if (userId && sessionId) {
      await aiService.saveChatHistory(userId, query, response, sessionId);
    }
    
    return response;
  };

  // Gets chat history for a specific session
  const getChatHistory = async (sessionId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId || !sessionId) return [];
    return await aiService.getChatHistory(userId, sessionId);
  };

  const updateSessionName = async (sessionId: string, newName: string) => {
    return await aiService.updateSessionName(sessionId, newName);
  };

  return { queryAI, getChatHistory, createNewSession, getUserSessions, updateSessionName };
};