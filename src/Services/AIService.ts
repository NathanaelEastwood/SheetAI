import TableData from "../Entities/Table/TableData";
import { useSelector } from "react-redux";
import { RootState } from "../main";

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

export class AIService {
    constructor() {
    }
    
    // Query the spreadsheet    
    async querySpreadsheet(
      query: string, 
      context: SpreadsheetContext
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
        return result.choices[0].message.content || "No response generated";
      } catch (error) {
        console.error('Error querying AI service:', error);
        throw error;
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
}

export const useAIAgent = () => {
  const tableData = useSelector((state: RootState) => state.globalTableData.value);
  const selectedCell = useSelector((state: RootState) => state.globalTableData.selectedCell);
  
  const aiService = new AIService();
  
  const queryAI = async (query: string, selectedRange?: { start: [number, number]; end: [number, number] }) => {
    const context = {
      tableData,
      selectedCell: selectedCell as [number, number],
      selectedRange
    };

    return await aiService.querySpreadsheet(query, context);
  };

  return { queryAI };
};