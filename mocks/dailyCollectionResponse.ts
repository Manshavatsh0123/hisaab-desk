export type CollectionStatus = "paid" | "due" | "overdue" | "not-due" | "matured";
export type Frequency =
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Half-Yearly"
  | "Yearly"
  | "One-Time";

export interface CollectionAccount {
  id: string;
  customerId: string;
  customer: string;
  phone: string;
  account: string;
  scheme: string;
  amount: number;
  frequency: Frequency;
  status: CollectionStatus;
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
  nextDue: string;
  /** ISO date -> total amount collected on that date */
  payments: Record<string, number>;
}

/** Mock response mirrors the shape expected from GET /api/collections/daily?month=YYYY-MM */
export const dailyCollectionResponse = {
  success: true,
  message: "Daily collection fetched successfully",
  data: {
    month: "2026-10",
    summary: {
      totalAccounts: 6,
      totalCollected: 11100,
      totalExpected: 19050,
      pendingAccounts: 3,
    },
    accounts: [
      {
        id: "a1", customerId: "CUS-001", customer: "Rahul Kumar", phone: "98XXXXXX21",
        account: "RD-1001", scheme: "Recurring Deposit", amount: 500, frequency: "Daily" as const,
        status: "paid" as const, startDate: "2024-09-26", maturityDate: "2028-09-18", maturityAmount: 26000,
        nextDue: "2026-10-10",
        payments: {
          "2026-10-01": 500, "2026-10-04": 500, "2026-10-06": 500, "2026-10-08": 500,
        },
      },
      {
        id: "a2", customerId: "CUS-001", customer: "Rahul Kumar", phone: "98XXXXXX21",
        account: "RD-1002", scheme: "Recurring Deposit", amount: 1000, frequency: "Weekly" as const,
        status: "due" as const, startDate: "2025-09-26", maturityDate: "2027-09-26", maturityAmount: 13500,
        nextDue: "2026-10-10",
        payments: { "2026-10-03": 1000, "2026-10-08": 500 },
      },
      {
        id: "a3", customerId: "CUS-002", customer: "Priya Sharma", phone: "97XXXXXX44",
        account: "PPF-2001", scheme: "Public Provident Fund", amount: 5000, frequency: "Yearly" as const,
        status: "not-due" as const, startDate: "2026-03-15", maturityDate: "2031-03-15", maturityAmount: 190000,
        nextDue: "2027-03-15",
        payments: { "2026-10-03": 5000 },
      },
      {
        id: "a4", customerId: "CUS-003", customer: "Amit Verma", phone: "99XXXXXX08",
        account: "MIS-3012", scheme: "Monthly Income Scheme", amount: 2000, frequency: "Monthly" as const,
        status: "overdue" as const, startDate: "2025-09-20", maturityDate: "2026-09-20", maturityAmount: 26500,
        nextDue: "2026-10-05",
        payments: { "2026-10-02": 500, "2026-10-05": 500 },
      },
      {
        id: "a5", customerId: "CUS-004", customer: "Neha Singh", phone: "96XXXXXX76",
        account: "TD-4050", scheme: "Time Deposit", amount: 10000, frequency: "Half-Yearly" as const,
        status: "matured" as const, startDate: "2023-12-18", maturityDate: "2026-12-18", maturityAmount: 48000,
        nextDue: "2026-12-18",
        payments: {},
      },
      {
        id: "a6", customerId: "CUS-005", customer: "Vikash Paswan", phone: "95XXXXXX12",
        account: "RD-5011", scheme: "Recurring Deposit", amount: 550, frequency: "Daily" as const,
        status: "paid" as const, startDate: "2025-04-01", maturityDate: "2028-04-01", maturityAmount: 21000,
        nextDue: "2026-10-10",
        payments: { "2026-10-01": 550, "2026-10-04": 550, "2026-10-06": 500, "2026-10-09": 550 },
      },
    ],
  },
};
