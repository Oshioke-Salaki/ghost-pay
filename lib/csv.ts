export function parseCSV(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const rows = lines.map((line) => {
    const [firstName, lastName, address, amount] = line
      .split(",")
      .map((c) => c.trim());
    return { address, amount: Number(amount), firstName, lastName };
  });
  return rows;
}

export function generateCSV(employees: { address: string; amount: number }[]) {
  return employees.map((e) => `${e.address},${e.amount}`).join("\n");
}
