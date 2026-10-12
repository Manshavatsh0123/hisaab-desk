"use client";

import { useMemo, useState } from "react";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { PageHeader } from "../common/PageHeader";
import { StatItem, StatsCards } from "../common/StatsCards";
import { CollectionTableSection } from "../common/CollectionTableSection";
import { CollectionAccount, CollectionModal } from "../common/CollectionModal";


const paidCustomers = [
  {
    name: "Rahul Kumar",
    id: "JS1024",
    amount: "₹500",
    scheme: "RD",
    time: "09:42 AM",
    staff: "Amit",
  },
  {
    name: "Priya Singh",
    id: "JS1088",
    amount: "₹1,000",
    scheme: "Monthly",
    time: "10:15 AM",
    staff: "Admin",
  },
  {
    name: "Suresh Yadav",
    id: "JS1016",
    amount: "₹500",
    scheme: "RD",
    time: "11:08 AM",
    staff: "Ravi",
  },
  {
    name: "Meena Devi",
    id: "JS1102",
    amount: "₹2,000",
    scheme: "Monthly",
    time: "12:26 PM",
    staff: "Amit",
  },
];

const dueCustomers = [
  {
    name: "Amit Kumar",
    id: "JS1042",
    amount: "₹500",
    scheme: "RD",
    dueDate: "26 Sep",
    staff: "Ravi",
  },
  {
    name: "Neha Devi",
    id: "JS1091",
    amount: "₹1,000",
    scheme: "Monthly",
    dueDate: "26 Sep",
    staff: "Amit",
  },
  {
    name: "Vikash Sharma",
    id: "JS1067",
    amount: "₹500",
    scheme: "RD",
    dueDate: "26 Sep",
    staff: "Ravi",
  },
];

const collectionSummary = [
  {
    day: "Mon",
    collected: 4200,
    due: 1800,
  },
  {
    day: "Tue",
    collected: 5800,
    due: 1200,
  },
  {
    day: "Wed",
    collected: 3600,
    due: 2400,
  },
  {
    day: "Thu",
    collected: 6900,
    due: 900,
  },
  {
    day: "Fri",
    collected: 5100,
    due: 1500,
  },
  {
    day: "Sat",
    collected: 7300,
    due: 800,
  },
  {
    day: "Sun",
    collected: 4000,
    due: 1100,
  },
];

const maxCollection = Math.max(
  ...collectionSummary.map(
    (item) => item.collected
  )
);

const totalDue = dueCustomers.reduce(
  (sum, customer) =>
    sum +
    Number(
      customer.amount.replace(/[₹,]/g, "")
    ),
  0
);

const sampleAccount: CollectionAccount = {
  id: "JS1024",
  customerName: "Rahul Kumar",
  installmentAmount: 1000,
  remainingDue: 3000,
  totalPaid: 2000,
  status: "Active",
};


export function OverviewSection({
  onNavigateToApprovals,
  onNavigateToAddCustomer,
}: {
  onNavigateToApprovals: () => void;
  onNavigateToAddCustomer: () => void;
}) {

  const [collectionOpen, setCollectionOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedAccount, setSelectedAccount] =
    useState<CollectionAccount | null>(null);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);


  async function handleAddCollection() {
    if (!selectedAccount || !amount || Number(amount) <= 0) {
      return;
    }

    setSubmitting(true);

    try {
      // Call your existing collection POST API here.
      // Send selectedAccount.id and Number(amount).
      // Refresh account details after a successful response.

      console.log({
        accountId: selectedAccount.id,
        amount: Number(amount),
      });

      setCollectionOpen(false);
      setSelectedCustomer("");
      setSelectedAccount(null);
      setAmount("");
    } finally {
      setSubmitting(false);
    }
  }


  const todayTotal = useMemo(
    () =>
      paidCustomers.reduce(
        (sum, customer) =>
          sum +
          Number(
            customer.amount.replace(/[₹,]/g, "")
          ),
        0
      ),
    []
  );

  const openCollection = (
    customer = ""
  ) => {
    setSelectedCustomer(customer);
    setCollectionOpen(true);
  };


  const overviewStats: StatItem[] = [
    {
      label: "This month",
      value: "₹4,000",
      helper: "4 listed payments",
      icon: CreditCard,
      tone: "primary",
    },
    {
      label: "Still Due",
      value: "₹2,000",
      helper: "3 listed customers",
      icon: CalendarDays,
      tone: "warning",
    },
    {
      label: "Total Customers",
      value: 524,
      helper: "Active customers",
      icon: Users,
      tone: "neutral",
    },
    {
      label: "Pending Approval",
      value: 12,
      helper: "Admin action required",
      icon: AlertCircle,
      tone: "warning",
    },
  ];

  return (

    <div
      className=" bg-[var(--hs-white)]">

      <div className=" px-[var(--hs-page-padding-x)] py-[var(--hs-page-padding-y)] ">

        <PageHeader
          eyebrow="Your collection workspace"
          title="One clear view."
          highlight="Every payment."
          subtitle="Track daily collections, monitor account activity, and keep every payment record organized."
          action={{
            label: "Collect payment",
            onClick: openCollection,
            icon: <Plus className="size-4" />,
          }}
        />

        <StatsCards items={overviewStats} columns={4} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 mt-[var(--hs-section-gap)]">
          <CollectionTableSection
            title="Recent collections"
            description="Latest customer payments"
            count={`${paidCustomers.length.toString().padStart(2, "0")} payments`}
            type="paid"
            rows={paidCustomers.map((customer) => ({
              id: customer.id,
              name: customer.name,
              amount: customer.amount,
            }))}
          />

          <CollectionTableSection
            title="Due Collection"
            description="Customers who have not paid today"
            count={`${dueCustomers.length} due`}
            type="due"
            rows={dueCustomers.map((customer) => ({
              id: customer.id,
              name: customer.name,
              amount: customer.amount,
              staff: customer.staff,
            }))}
            onCollect={openCollection}
          />
        </div>

        {collectionOpen && (

          <CollectionModal
            open={collectionOpen}
            onClose={() => setCollectionOpen(false)}
            searchValue={selectedCustomer}
            onSearchChange={(value) => {
              setSelectedCustomer(value);
              setSelectedAccount(null);
            }}
            account={selectedAccount}
            amount={amount}
            onAmountChange={setAmount}
            onSubmit={handleAddCollection}
            submitting={submitting}
          />
        )}

      </div>

    </div>
  );
}