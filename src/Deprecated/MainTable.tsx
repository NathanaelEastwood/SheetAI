// @ts-ignore
import React, {useMemo, useState} from "react";
import {
    useReactTable,
    ColumnDef,
    flexRender,
    getCoreRowModel,
} from "@tanstack/react-table";

interface TableProps {
    columnNames: string[]; // Array of column names
    data: any[][]; // 2D array of data
}

const MyTable: React.FC<TableProps> = ({ columnNames, data }) => {
    // Generate column definitions dynamically
    const columns = useMemo<ColumnDef<any>[]>(
        () =>
            columnNames.map((name, index) => ({
                accessorKey: name.toLowerCase(), // Match data keys (case-insensitive)
                header: name,
            })),
        [columnNames]
    );

    // Convert the 2D array into objects for the table
    const formattedData = useMemo(
        () =>
            data.map((row) =>
                row.reduce((acc, cell, index) => {
                    acc[columnNames[index].toLowerCase()] = cell;
                    return acc;
                }, {} as Record<string, any>)
            ),
        [data, columnNames]
    );

    // Create table instance
    const table = useReactTable({
        data: formattedData,
        columns,
        getCoreRowModel: getCoreRowModel(), // Essential for table rendering
    });

    return (
        <table style={{ border: "1px solid black", width: "100%", borderCollapse: "collapse" }}>
            <thead>
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <th
                            key={header.id}
                            style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                    textAlign: "left",
                                    backgroundColor: "#f1f1f1",
                            }}
                        >
                            {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                        <td
                            key={cell.id}
                            style={{
                                border: "1px solid black",
                                padding: "8px",
                            }}
                        >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default MyTable;
