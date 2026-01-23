"use client";
import React from "react";
import { ArrowDownLeft, Calendar, Building2, CheckCircle2 } from "lucide-react";

// Mock Data
const RECENT_PAYMENTS = [
  {
    id: 1,
    org: "Starkware",
    date: "2023-11-01",
    amount: 2500.00,
    status: "Completed",
    type: "Salary"
  },
  {
    id: 2,
    org: "Argent",
    date: "2023-10-15",
    amount: 2000.00,
    status: "Completed",
    type: "Bonus"
  },
  {
    id: 3,
    org: "Starkware",
    date: "2023-10-01",
    amount: 2500.00,
    status: "Completed",
    type: "Salary"
  }
];

export default function PersonalRecentActivity() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-gray-500 hover:text-black transition-colors font-medium">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Organization</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {RECENT_PAYMENTS.map((payment) => (
              <tr 
                key={payment.id} 
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <Building2 size={16} />
                    </div>
                    <span className="font-bold text-gray-900">{payment.org}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md font-medium">
                    {payment.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    {new Date(payment.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                    <CheckCircle2 size={14} />
                    {payment.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 font-bold text-gray-900">
                     <ArrowDownLeft size={16} className="text-green-500" />
                     {payment.amount.toFixed(2)} STRK
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
