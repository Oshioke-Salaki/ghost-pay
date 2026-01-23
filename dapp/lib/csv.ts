export function parseCSV(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const rows = lines.map((line) => {
    const [first_name, last_name, address, salary] = line
      .split(",")
      .map((c) => c.trim());
    return { address, salary_usd: Number(salary), first_name, last_name };
  });
  return rows;
}

export function generateCSV(employees: { address: string; amount: number }[]) {
  return employees.map((e) => `${e.address},${e.amount}`).join("\n");
}
