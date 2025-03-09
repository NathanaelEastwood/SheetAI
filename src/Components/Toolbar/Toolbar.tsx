import React, { useState } from 'react';

interface MenuOption {
    label?: string;
    shortcut?: string;
    divider?: boolean;
    submenu?: MenuOption[];
}

const fileMenuOptions: MenuOption[] = [
    { label: 'New', shortcut: 'Ctrl+N' },
    { label: 'Open...', shortcut: 'Ctrl+O' },
    { label: 'Recent', submenu: [
        { label: 'Document 1.xlsx' },
        { label: 'Document 2.xlsx' },
        { label: 'Browse recent files...' }
    ]},
    { label: 'Save', shortcut: 'Ctrl+S' },
    { label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
    { divider: true },
    { label: 'Print', shortcut: 'Ctrl+P' },
    { label: 'Export', submenu: [
        { label: 'Export as PDF' },
        { label: 'Export as CSV' }
    ]},
    { divider: true },
    { label: 'Close', shortcut: 'Ctrl+W' }
];

const homeMenuOptions: MenuOption[] = [
    { label: 'Paste Options' },
    { label: 'Cut', shortcut: 'Ctrl+X' },
    { label: 'Copy', shortcut: 'Ctrl+C' },
    { divider: true },
    { label: 'Format Cells...' },
    { label: 'Cell Styles' }
];

const insertMenuOptions: MenuOption[] = [
    { label: 'Insert Cells...' },
    { label: 'Insert Sheet Rows' },
    { label: 'Insert Sheet Columns' },
    { divider: true },
    { label: 'Chart...' },
    { label: 'Function...' },
    { label: 'Image...' },
    { label: 'Link...', shortcut: 'Ctrl+K' }
];

const menuOptions: Record<string, MenuOption[]> = {
    'File': fileMenuOptions,
    'Home': homeMenuOptions,
    'Insert': insertMenuOptions,
    'Page Layout': [],
    'Formulas': [],
    'Data': [],
    'Review': [],
    'View': [],
    'Help': []
};

const Toolbar: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);

    const handleMenuClick = (menuName: string, event: React.MouseEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setMenuPosition({ 
            top: rect.bottom, 
            left: rect.left 
        });
        
        if (activeMenu === menuName) {
            setActiveMenu(null);
        } else {
            setActiveMenu(menuName);
        }
    };

    const handleClickOutside = () => {
        setActiveMenu(null);
    };

    return (
        <div style={{
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6',
            padding: '4px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
        }}>
            {/* File menu bar */}
            <div style={{
                display: 'flex',
                gap: '16px',
                padding: '4px 8px',
                borderBottom: '1px solid #dee2e6'
            }}>
                {Object.keys(menuOptions).map(item => (
                    <div 
                        key={item} 
                        onClick={(e) => handleMenuClick(item, e)}
                        style={{
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#212529',
                            backgroundColor: activeMenu === item ? '#e9ecef' : 'transparent',
                            borderRadius: '2px'
                        }}
                    >
                        {item}
                    </div>
                ))}
            </div>

            {/* Dropdown menu */}
            {activeMenu && (
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
                        top: menuPosition.top,
                        left: menuPosition.left,
                        backgroundColor: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                        zIndex: 101,
                        minWidth: '200px'
                    }}>
                        {menuOptions[activeMenu].map((option, index) => (
                            option.divider ? (
                                <div 
                                    key={`divider-${index}`} 
                                    style={{ 
                                        height: '1px', 
                                        backgroundColor: '#dee2e6', 
                                        margin: '4px 0' 
                                    }} 
                                />
                            ) : (
                                <div 
                                    key={option.label} 
                                    onMouseEnter={() => setHoveredMenuItem(option.label || '')}
                                    onMouseLeave={() => setHoveredMenuItem(null)}
                                    style={{
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        backgroundColor: hoveredMenuItem === option.label ? '#f8f9fa' : 'transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {option.label}
                                        {option.submenu && (
                                            <span style={{ marginLeft: '8px' }}>▶</span>
                                        )}
                                    </div>
                                    {option.shortcut && (
                                        <div style={{ 
                                            color: '#6c757d', 
                                            fontSize: '12px',
                                            marginLeft: '16px'
                                        }}>
                                            {option.shortcut}
                                        </div>
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                </>
            )}

            {/* Main toolbar */}
            <div style={{
                display: 'flex',
                gap: '16px',
                padding: '4px'
            }}>
                {/* Clipboard section */}
                <ToolbarSection>
                    <ToolbarButton icon="📋" label="Paste" />
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="✂️" label="Cut" small />
                        <ToolbarButton icon="📄" label="Copy" small />
                        <ToolbarButton icon="🧹" label="Format Painter" small />
                    </div>
                    <div style={{ fontSize: '12px', textAlign: 'center' }}>Clipboard</div>
                </ToolbarSection>

                {/* Font section */}
                <ToolbarSection>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        <select style={{
                            padding: '2px 4px',
                            fontSize: '12px',
                            border: '1px solid #ced4da',
                            borderRadius: '2px',
                            width: '120px'
                        }}>
                            <option>Arial</option>
                            <option>Calibri</option>
                            <option>Times New Roman</option>
                        </select>
                        <select style={{
                            padding: '2px 4px',
                            fontSize: '12px',
                            border: '1px solid #ced4da',
                            borderRadius: '2px',
                            width: '50px'
                        }}>
                            <option>10</option>
                            <option>11</option>
                            <option>12</option>
                            <option>14</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="𝐁" label="Bold" small />
                        <ToolbarButton icon="𝐼" label="Italic" small />
                        <ToolbarButton icon="U̲" label="Underline" small />
                        <ToolbarButton icon="A̶" label="Strikethrough" small />
                        <ToolbarButton icon="A" label="Text Color" small />
                        <ToolbarButton icon="🎨" label="Fill Color" small />
                        <ToolbarButton icon="Aa" label="Text Effects" small />
                    </div>
                    <div style={{ fontSize: '12px', textAlign: 'center' }}>Font</div>
                </ToolbarSection>

                {/* Alignment section */}
                <ToolbarSection>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="⫷" label="Left Align" small />
                        <ToolbarButton icon="⧾" label="Center" small />
                        <ToolbarButton icon="⫸" label="Right Align" small />
                        <ToolbarButton icon="≡" label="Justify" small />
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="↑" label="Top Align" small />
                        <ToolbarButton icon="↔" label="Middle Align" small />
                        <ToolbarButton icon="↓" label="Bottom Align" small />
                        <ToolbarButton icon="↻" label="Rotate" small />
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="⇥" label="Indent" small />
                        <ToolbarButton icon="⇤" label="Outdent" small />
                        <ToolbarButton icon="⊞" label="Merge" small />
                        <ToolbarButton icon="⊟" label="Wrap" small />
                    </div>
                    <div style={{ fontSize: '12px', textAlign: 'center' }}>Alignment</div>
                </ToolbarSection>

                {/* Number section */}
                <ToolbarSection>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="$" label="Currency" small />
                        <ToolbarButton icon="%" label="Percent" small />
                        <ToolbarButton icon=".0" label="Decimal" small />
                        <ToolbarButton icon="1k" label="Thousands" small />
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="+" label="Increase Decimal" small />
                        <ToolbarButton icon="-" label="Decrease Decimal" small />
                        <ToolbarButton icon="📅" label="Date" small />
                        <ToolbarButton icon="⏱️" label="Time" small />
                    </div>
                    <div style={{ fontSize: '12px', textAlign: 'center' }}>Number</div>
                </ToolbarSection>

                {/* Styles section */}
                <ToolbarSection>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                        <select style={{
                            padding: '2px 4px',
                            fontSize: '12px',
                            border: '1px solid #ced4da',
                            borderRadius: '2px',
                            width: '120px'
                        }}>
                            <option>Normal</option>
                            <option>Bad</option>
                            <option>Good</option>
                            <option>Neutral</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="🎭" label="Conditional Formatting" small />
                        <ToolbarButton icon="📊" label="Table Styles" small />
                        <ToolbarButton icon="🖌️" label="Cell Styles" small />
                    </div>
                    <div style={{ fontSize: '12px', textAlign: 'center' }}>Styles</div>
                </ToolbarSection>

                {/* Cells section */}
                <ToolbarSection>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="➕" label="Insert" small />
                        <ToolbarButton icon="➖" label="Delete" small />
                        <ToolbarButton icon="↕" label="Format" small />
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="⊞" label="Cell Size" small />
                        <ToolbarButton icon="👁️" label="Visibility" small />
                        <ToolbarButton icon="🔒" label="Protect" small />
                    </div>
                    <div style={{ fontSize: '12px', textAlign: 'center' }}>Cells</div>
                </ToolbarSection>

                {/* Editing section */}
                <ToolbarSection>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="Σ" label="Sum" small />
                        <ToolbarButton icon="🔍" label="Find" small />
                        <ToolbarButton icon="🔄" label="Sort & Filter" small />
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="✓" label="Fill" small />
                        <ToolbarButton icon="❌" label="Clear" small />
                        <ToolbarButton icon="📝" label="Comment" small />
                        <ToolbarButton icon="🔗" label="Link" small />
                    </div>
                    <div style={{ fontSize: '12px', textAlign: 'center' }}>Editing</div>
                </ToolbarSection>

                {/* Insert section */}
                <ToolbarSection>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="📊" label="Chart" small />
                        <ToolbarButton icon="📈" label="Sparkline" small />
                        <ToolbarButton icon="🔢" label="Function" small />
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        <ToolbarButton icon="🖼️" label="Image" small />
                        <ToolbarButton icon="▢" label="Shape" small />
                        <ToolbarButton icon="📝" label="Text Box" small />
                    </div>
                    <div style={{ fontSize: '12px', textAlign: 'center' }}>Insert</div>
                </ToolbarSection>
            </div>
        </div>
    );
};

interface ToolbarSectionProps {
    children: React.ReactNode;
}

const ToolbarSection: React.FC<ToolbarSectionProps> = ({ children }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '4px 8px',
            borderRight: '1px solid #dee2e6'
        }}>
            {children}
        </div>
    );
};

interface ToolbarButtonProps {
    icon: string;
    label: string;
    small?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, label, small = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <div 
            title={label}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: small ? '2px 4px' : '4px 8px',
                border: isHovered ? '1px solid #ced4da' : '1px solid transparent',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: small ? '12px' : '14px',
                width: small ? '24px' : 'auto',
                height: small ? '24px' : 'auto',
                backgroundColor: isHovered ? '#e9ecef' : 'transparent'
            }}
        >
            {icon}
        </div>
    );
};

export default Toolbar;