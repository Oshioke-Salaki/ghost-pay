// "use client";
// import React, { useState } from "react";
// import { NextPage } from "next";
// import { usePayrollStore } from "@/store/payrollStore";
// import DataTable from "@/components/DataTable";
// import AlertBanner from "@/components/AlertBanner";
// import LoadingIndicator from "@/components/LoadingIndicator";
// import { parseCSV } from "@/lib/csv";
// import { Employee } from "@/types/employee";

// const ReviewPage: NextPage = () => {
//   const { employees, addEmployees, removeEmployee, clear } = usePayrollStore();
//   const [csvText, setCsvText] = useState("");

//   const handleCsvImport = () => {
//     try {
//       const parsed = parseCSV(csvText);
//       addEmployees(parsed);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to parse CSV");
//     }
//   };

//   const columns: { header: string; accessor: keyof Employee }[] = [
//     { header: "Address", accessor: "address" },
//     { header: "Amount", accessor: "amount" },
//     { header: "Deposit Tx", accessor: "depositTx" },
//     { header: "Withdraw Tx", accessor: "withdrawTx" },
//   ];

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Review Payroll</h1>
//       <textarea
//         className="w-full border p-2 mb-2"
//         placeholder="Paste CSV here: address,amount"
//         value={csvText}
//         onChange={(e) => setCsvText(e.target.value)}
//         rows={5}
//       />
//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={handleCsvImport}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Import CSV
//         </button>
//         <button
//           onClick={() => clear()}
//           className="bg-red-500 text-white px-4 py-2 rounded"
//         >
//           Clear All
//         </button>
//       </div>
//       {employees.length === 0 ? (
//         <AlertBanner message="No employees added yet." type="info" />
//       ) : (
//         <DataTable data={employees} columns={columns} />
//       )}
//     </div>
//   );
// };

// export default ReviewPage;
import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
