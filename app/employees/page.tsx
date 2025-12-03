"use client";
import AddEmployeeForm from "./components/AddEmployeeForm";
import CSVUploader from "./components/CSVUploader";
import EmployeeTable from "./components/EmployeeTable";

export default function EmployeesPage() {
  return (
    <div className="py-10">
      <h2 className="text-4xl font-bold">Add Employees</h2>
      <div className="mt-4 grid grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded shadow-sm">
          <AddEmployeeForm />
        </div>
        <div className="p-4 bg-white rounded shadow-sm">
          <CSVUploader />
        </div>
      </div>

      <div className="mt-6">
        <EmployeeTable />
      </div>
    </div>
  );
}
