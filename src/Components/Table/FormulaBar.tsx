import React, { useState, KeyboardEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../main';
import Cell from '../../Entities/Table/Cell';
import { updateGlobalTableData } from '../../Entities/Table/globalStateStore';
import parse from '../../Entities/Table/FormulaParser';
import { getLetterFromNumber } from '../../Entities/General/HelperFunctions';

const FormulaBar: React.FC = () => {
    const dispatch = useDispatch();
    const selectedCell = useSelector((state: RootState) => state.globalTableData.selectedCell) as [number, number];
    const tableData = useSelector((state: RootState) => state.globalTableData.value);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [hasInitialized, setHasInitialized] = useState(false);
    
    // Initialize the input value when the selected cell changes
    const currentCellValue = tableData.getCellValue(selectedCell[0], selectedCell[1]).UnderlyingValue;
    if (!hasInitialized || currentCellValue !== inputValue && !isFocused) {
        setInputValue(currentCellValue);
        if (!hasInitialized) {
            setHasInitialized(true);
        }
    }
    
    const handleFormulaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Just update the local state without evaluating the formula
        setInputValue(event.target.value);
    };
    
    const evaluateFormula = () => {
        const currentCell = tableData.getCellValue(selectedCell[0], selectedCell[1]);
        
        let newCell: Cell;
        if (inputValue.startsWith('=')) {
            newCell = parse(new Cell('', inputValue, currentCell.Dependants), tableData, selectedCell);
        } else {
            newCell = new Cell(inputValue, inputValue, currentCell.Dependants);
        }
        
        const newTableData = tableData.setCellValue(newCell, selectedCell[0], selectedCell[1]);
        dispatch(updateGlobalTableData(newTableData));
    };
    
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // Prevent default behavior and stop propagation to prevent table cell from going into edit mode
            event.preventDefault();
            event.stopPropagation();
            
            evaluateFormula();
            setIsFocused(false);
            (event.target as HTMLInputElement).blur();
        } else if (event.key === 'Escape') {
            // Reset to original value on Escape
            event.preventDefault();
            event.stopPropagation();
            
            setInputValue(currentCellValue);
            setIsFocused(false);
            (event.target as HTMLInputElement).blur();
        }
    };
    
    const handleBlur = () => {
        setIsFocused(false);
        evaluateFormula();
    };
    
    const cellReference = `${getLetterFromNumber(selectedCell[0] + 1)}${selectedCell[1] + 1}`;

    return (
        <div style={{
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #dee2e6',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            height: '48px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}>
                <div style={{
                    padding: '4px 8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa',
                    fontSize: '14px',
                    minWidth: '80px',
                    textAlign: 'center',
                    color: '#495057'
                }}>
                    {cellReference}
                </div>
            </div>
            <span style={{
                fontWeight: 500,
                color: '#666',
                fontSize: '14px'
            }}>
                    fx
                </span>
            <input
                type="text"
                value={inputValue}
                onChange={handleFormulaChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="Enter a value or formula starting with ="
                style={{
                    flex: 1,
                    padding: '6px 12px',
                    border: '1px solid ' + (isFocused ? '#86b7fe' : '#ced4da'),
                    borderRadius: '4px',
                    fontSize: '14px',
                    height: '32px',
                    outline: 'none',
                    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                    boxShadow: isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : 'none'
                }}
            />
        </div>
    );
};

export default FormulaBar; 