import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    console.log("📝 Parsing text:", text);

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const employees = [];

    // Regex to find Starknet Addresses (0x followed by ~64 hex chars)
    // Matches: 0x[hex]
    const addressRegex = /(0x[a-fA-F0-9]{50,66})/g;

    // Split the text into segments (assuming "and" or newlines separate people)
    // Example: "Pay Alice 50... and Pay Bob 20..."
    const segments = text.split(/and|\n|,/);

    for (const segment of segments) {
      // 1. Extract Address
      const addressMatch = segment.match(addressRegex);
      if (!addressMatch) continue; // No address, skip this segment
      const address = addressMatch[0];

      // 2. Extract Amount (Look for numbers followed by STRK or just numbers)
      // Matches: 500 or 500.00
      const amountRegex = /(\d+(\.\d+)?)\s*(?:STRK)?/i;
      const amountMatch = segment.match(amountRegex);
      const salary = amountMatch ? parseFloat(amountMatch[1]) : 0;

      // 3. Extract Name (Everything else that isn't the address or keywords)
      // Remove keywords: Pay, Send, Give, STRK, the address, the amount
      let cleanName = segment
        .replace(address, "")
        .replace(salary.toString(), "")
        .replace(/pay|send|give|strk|to|from|is/gi, "")
        .replace(/[(),]/g, "") // Remove brackets and commas
        .trim();

      // Split name into First/Last
      const nameParts = cleanName.split(/\s+/);
      const first_name = nameParts[0] || "Unknown";
      const last_name = nameParts.slice(1).join(" ") || "";

      if (address && salary > 0) {
        employees.push({
          first_name,
          last_name,
          address,
          salary,
        });
      }
    }

    console.log("✅ Extracted:", employees);

    // Add artificial delay so the user sees the "Magic" spinner
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ employees });
  } catch (error: any) {
    console.error("🔥 Parser Error:", error);
    return NextResponse.json(
      { error: "Failed to parse text" },
      { status: 500 }
    );
  }
}
