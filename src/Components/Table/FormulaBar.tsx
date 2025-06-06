import React, {useState, KeyboardEvent, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../main';
import Cell from '../../Entities/Table/Cell';
import { updateGlobalTableData } from '../../Entities/Table/globalStateStore';
import parse from '../../Entities/Table/FormulaParser';
import { getLetterFromNumber } from '../../Entities/General/HelperFunctions';

type FormulaType = 'traditional' | 'prompt';

const FormulaBar: React.FC = () => {
    const API_URL = "http://localhost:5000/data";
    const dispatch = useDispatch();
    const selectedCell = useSelector((state: RootState) => state.globalTableData.selectedCell) as [number, number];
    const darkModeState: boolean = useSelector((state: RootState) => state.globalDarkMode);
    const tableData = useSelector((state: RootState) => state.globalTableData.value);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [hasInitialized, setHasInitialized] = useState(false);
    const [formulaType, setFormulaType] = useState<FormulaType>('traditional');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
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
    
    const evaluateFormula = async () => {
        const currentCell = tableData.getCellValue(selectedCell[0], selectedCell[1]);
        let newCell: Cell;
        if (inputValue.startsWith('=')) {
            // Handle different formula types
            if (formulaType === 'traditional') {
                newCell = parse(new Cell('', inputValue, currentCell.Dependants), tableData, selectedCell);
            } else if (formulaType === 'prompt') {
                await fetch(API_URL, {
                    method: "POST", // Use POST to send data
                    headers: {
                        "Content-Type": "application/json", // Set JSON content type
                    },
                    body: JSON.stringify({"prompt_value": inputValue}), // Convert JS object to JSON
                })
                    .then((response) => response.json())
                    .then((result) => newCell = parse(new Cell('', result.choices[0].message.content, currentCell.Dependants), tableData, selectedCell))
                    .catch((error) => console.error("Error fetching data:", error));

            } else {
                newCell = parse(new Cell('', inputValue, currentCell.Dependants), tableData, selectedCell);
            }
        } else {
            newCell = new Cell(inputValue, inputValue, currentCell.Dependants);
        }

        const newTableData = tableData.setCellValue(newCell, selectedCell[0], selectedCell[1]);
        dispatch(updateGlobalTableData(newTableData));
    };
    
    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            // Prevent default behavior and stop propagation to prevent table cell from going into edit mode
            event.preventDefault();
            event.stopPropagation();

            await evaluateFormula();
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
        evaluateFormula().then(() => setIsFocused(false));
    };

    const handleFormulaTypeChange = (type: FormulaType) => {
        setFormulaType(type);
        setIsDropdownOpen(false);
    };

    const handleClickOutside = () => {
        setIsDropdownOpen(false);
    };
    
    const cellReference = `${getLetterFromNumber(selectedCell[0] + 1)}${selectedCell[1] + 1}`;

    return (
        <div style={{
            position: "absolute",
            top: "155px",
            padding: '8px 16px',
            backgroundColor: darkModeState ? '#ffffff' : "#000000",
            borderBottom: '1px solid #dee2e6',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: darkModeState ? '0 1px 3px rgba(0,0,0,0.1)' : '0 1px 3px rgba(255,255,255,0.1)',
            height: '48px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '180px'
            }}>
                <div style={{ position: 'relative' }}>
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            backgroundColor: darkModeState? '#f8f9fa' : "#070605",
                            fontSize: '14px',
                            cursor: 'pointer',
                            minWidth: '120px',
                            justifyContent: 'space-between'
                        }}
                    >
                        <span style={{ fontWeight: 500, color: darkModeState ? '#666' : "#999999"}}>
                            {formulaType === 'traditional' ? 'fx' : '🤖'}
                        </span>
                        <span style={{ color: darkModeState ? '#495057' : "#b6afa8" }}>
                            {formulaType === 'traditional' ? 'Traditional' : 'Prompt'}
                        </span>
                        <span>▼</span>
                    </div>
                    
                    {isDropdownOpen && (
                        <>
                            <div 
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 100
                                }}
                                onClick={handleClickOutside}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                backgroundColor: darkModeState ? 'white' : 'black',
                                boxShadow: darkModeState ? '0 2px 10px rgba(0,0,0,0.2)' : '0 2px 10px rgba(255,255,255,0.2)',
                                borderRadius: '4px',
                                zIndex: 101,
                                width: '100%',
                                marginTop: '4px'
                            }}>
                                <div 
                                    onClick={() => handleFormulaTypeChange('traditional')}
                                    style={{
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        backgroundColor: darkModeState ? formulaType === 'traditional' ? '#f8f9fa' : 'transparent' : formulaType === 'traditional' ? '#070605' : 'transparent'
                                    }}
                                >
                                    <span style={{ fontWeight: 500, color: darkModeState ? '#666' : "#999999" }}>fx</span>
                                    <span>Traditional</span>
                                </div>
                                <div 
                                    onClick={() => handleFormulaTypeChange('prompt')}
                                    style={{
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        backgroundColor: darkModeState ? formulaType === 'traditional' ? '#f8f9fa' : 'transparent' : formulaType === 'traditional' ? '#070605' : 'transparent'
                                    }}
                                >
                                    <span style={{ fontWeight: 500, color: darkModeState ? '#666' : "#999999" }}>🤖</span>
                                    <span>Prompt</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                <div style={{
                    padding: '4px 8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    backgroundColor: darkModeState ? '#f8f9fa' : "#070605",
                    fontSize: '14px',
                    minWidth: '60px',
                    textAlign: 'center',
                    color: darkModeState ? '#495057' : '#b6afa8'
                }}>
                    {cellReference}
                </div>
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={handleFormulaChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={formulaType === 'traditional' 
                    ? "Enter a value or formula starting with =" 
                    : "Enter a value or AI prompt starting with ="}
                style={{
                    flex: 1,
                    padding: '6px 12px',
                    backgroundColor: darkModeState ? '#f8f9fa' : "#070605",
                    border: darkModeState ? ('1px solid ' + (isFocused ? '#86b7fe' : '#ced4da')) : ('1px solid ' + (isFocused ? '#794801' : '#312b25')),
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