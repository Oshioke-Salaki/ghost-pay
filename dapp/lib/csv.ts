export function parseCSV(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  // Check for header
  const firstLine = lines[0].toLowerCase();
  if (
    firstLine.includes("first") ||
    firstLine.includes("address") ||
    firstLine.includes("amount") ||
    firstLine.includes("salary")
  ) {
    lines.shift();
  }

  const rows = lines
    .map((line) => {
      const parts = line.split(",").map((c) => c.trim());

      // Basic validation: ensure we have at least 4 parts
      if (parts.length < 4) return null;

      const [first_name, last_name, address, salary, position] = parts;

      const salaryNum = Number(salary);
      if (isNaN(salaryNum)) return null;

      const obj: {
        first_name: string;
        last_name: string;
        address: string;
        salary_usd: number;
        position?: string;
      } = {
        first_name,
        last_name,
        address,
        salary_usd: salaryNum,
      };

      if (position) {
        obj.position = position;
      }

      return obj;
    })
    .filter(
      (
        item,
      ): item is {
        first_name: string;
        last_name: string;
        address: string;
        salary_usd: number;
        position?: string;
      } => item !== null,
    );

  return rows;
}

export function generateCSV(employees: { address: string; amount: number }[]) {
  return employees.map((e) => `${e.address},${e.amount}`).join("\n");
}
