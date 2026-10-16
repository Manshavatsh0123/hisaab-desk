function formatAmount(value: number | string) {
  const amount = Number(value);

  return Number.isFinite(amount)
    ? `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
    : String(value);
}

export default function parseNotificationMessage(message: string) {
  const text = message || "";
  const match = text.match(
    /^(.+?)\s+submitted\s+₹?([\d,]+(?:\.\d{1,2})?)\s+for\s+(.+)$/i
  );

  if (!match) {
    return {
      agent: "Collection agent",
      customer: text || "Customer not specified",
      amount: null as string | null,
    };
  }

  return {
    agent: match[1].trim(),
    amount: formatAmount(match[2].replace(/,/g, "")),
    customer: match[3].trim(),
  };
}