import React from "react";

interface DataTableProps<T> {
  data: T[];
  columns: { header: string; accessor: keyof T }[];
}

function DataTable<T extends object>({ data, columns }: DataTableProps<T>) {
  return (
    <table className="min-w-full border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th
              key={String(col.accessor)}
              className="px-4 py-2 text-left text-gray-700 font-medium"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
            {columns.map((col) => (
              <td
                key={String(col.accessor)}
                className="px-4 py-2 text-gray-600"
              >
                {row[col.accessor] as React.ReactNode}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
