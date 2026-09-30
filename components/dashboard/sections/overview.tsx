"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";

const paidCustomers = [
  { name: "Rahul Kumar", id: "JS1024", amount: "₹500", scheme: "RD", time: "09:42 AM", staff: "Amit" },
  { name: "Priya Singh", id: "JS1088", amount: "₹1,000", scheme: "Monthly", time: "10:15 AM", staff: "Admin" },
  { name: "Suresh Yadav", id: "JS1016", amount: "₹500", scheme: "RD", time: "11:08 AM", staff: "Ravi" },
  { name: "Meena Devi", id: "JS1102", amount: "₹2,000", scheme: "Monthly", time: "12:26 PM", staff: "Amit" },
];

const dueCustomers = [
  { name: "Amit Kumar", id: "JS1042", amount: "₹500", scheme: "RD", dueDate: "26 Sep", staff: "Ravi" },
  { name: "Neha Devi", id: "JS1091", amount: "₹1,000", scheme: "Monthly", dueDate: "26 Sep", staff: "Amit" },
  { name: "Vikash Sharma", id: "JS1067", amount: "₹500", scheme: "RD", dueDate: "26 Sep", staff: "Ravi" },
];

const collectionSummary = [
  { day: "Mon", collected: 4200, due: 1800 },
  { day: "Tue", collected: 5800, due: 1200 },
  { day: "Wed", collected: 3600, due: 2400 },
  { day: "Thu", collected: 6900, due: 900 },
  { day: "Fri", collected: 5100, due: 1500 },
  { day: "Sat", collected: 7300, due: 800 },
  { day: "Sun", collected: 4000, due: 1100 },
];

const maxCollection = Math.max(...collectionSummary.map((item) => item.collected));
const totalDue = dueCustomers.reduce((sum, customer) => sum + Number(customer.amount.replace(/[₹,]/g, "")), 0);

function SectionHeader({ title, description, count }: { title: string; description: string; count?: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      {count && <span className="text-sm font-medium text-muted-foreground">{count}</span>}
    </div>
  );
}

export function OverviewSection({ onNavigateToApprovals, onNavigateToAddCustomer }: { onNavigateToApprovals: () => void; onNavigateToAddCustomer: () => void }) {
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const todayTotal = useMemo(() => paidCustomers.reduce((sum, customer) => sum + Number(customer.amount.replace(/[₹,]/g, "")), 0), []);

  const openCollection = (customer = "") => {
    setSelectedCustomer(customer);
    setCollectionOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 bg-[#f7faf7] text-[#173b30]">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#466257]">Overview / Collection desk</p><h2 className="text-3xl font-bold tracking-tight text-[#173b30] sm:text-4xl">One clear view. <span className="bg-[#c4f36b] px-2">Every payment.</span></h2><p className="mt-2 text-sm text-[#6b8176]">The numbers you need, without the noise.</p></div><button type="button" onClick={() => openCollection()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-[#173b30] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#285444]"><Plus className="size-4" />Collect payment</button></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Collected Today" value={`₹${todayTotal.toLocaleString("en-IN")}`} change={`${paidCustomers.length} listed payments`} changeType="positive" icon={CreditCard} delay={0} className="border-[#173b30] bg-[#173b30] text-white [&_span]:text-white [&_p]:text-white/70 [&_svg]:text-[#c4f36b] [&_div]:border-white/10" />
        <MetricCard title="Still Due" value={`₹${totalDue.toLocaleString("en-IN")}`} change={`${dueCustomers.length} listed customers`} changeType="neutral" icon={CalendarDays} delay={1} className="border-[#c4f36b] bg-[#c4f36b] text-[#173b30] [&_p]:text-[#173b30]/70" />
        <MetricCard title="Total Customers" value="524" change="Active customers" changeType="neutral" icon={Users} delay={2} className="border-[#d8e7df] bg-[#e8f2ed]" />
        <MetricCard title="Pending Approval" value="12" change="Admin action required" changeType="negative" icon={AlertCircle} delay={3} className="border-[#eadfc8] bg-[#f5eddc]" />
      </div>


      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-[#d8e7df] bg-white p-5 shadow-sm">
          <SectionHeader title="Recent collections" description="Latest customer payments" count={`${paidCustomers.length.toString().padStart(2, "0")} payments`} />
          <div className="mt-5 space-y-2 md:hidden">
            {paidCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-foreground">{customer.name}</p><p className="text-xs text-muted-foreground">{customer.id}</p></div>
                <div className="shrink-0 text-right"><p className="text-sm font-semibold text-foreground">{customer.amount}</p><span className="inline-flex items-center gap-1 text-xs font-medium text-success"><CheckCircle2 className="size-3.5" />Paid</span></div>
              </div>
            ))}
          </div>
          <div className="mt-5 hidden overflow-hidden md:block">
            <table className="w-full table-fixed text-left text-xs lg:text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr>{["Customer", "ID", "Amount", "Status"].map((heading) => <th key={heading} className="px-3 pb-3 font-medium">{heading}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paidCustomers.map((customer) => (
                  <tr key={customer.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-3 py-4 font-medium text-foreground">{customer.name}</td>
                    <td className="px-3 py-4 text-muted-foreground">{customer.id}</td>
                    <td className="px-3 py-4 font-semibold text-foreground">{customer.amount}</td>
                    <td className="px-3 py-4"><span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success"><CheckCircle2 className="h-3.5 w-3.5" />Paid</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <SectionHeader title="Due Collection" description="Customers who have not paid today" count={`${dueCustomers.length} due`} />
          <div className="mt-5 space-y-2 md:hidden">
            {dueCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-foreground">{customer.name}</p><p className="text-xs text-muted-foreground">{customer.id} · {customer.staff}</p></div>
                <div className="shrink-0 text-right"><p className="text-sm font-semibold text-foreground">{customer.amount}</p><button type="button" onClick={() => openCollection(customer.name)} className="text-xs font-medium text-warning hover:underline">Due</button></div>
              </div>
            ))}
          </div>
          <div className="mt-5 hidden overflow-hidden md:block">
            <table className="w-full table-fixed text-left text-xs lg:text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr>{["Customer", "ID", "Amount", "Status"].map((heading) => <th key={heading} className="px-3 pb-3 font-medium">{heading}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {dueCustomers.map((customer) => (
                  <tr key={customer.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-3 py-4 font-medium text-foreground">{customer.name}</td>
                    <td className="px-3 py-4 text-muted-foreground">{customer.id}</td>
                    <td className="px-3 py-4 font-semibold text-foreground">{customer.amount}</td>
                    <td className="px-3 py-4"><button type="button" onClick={() => openCollection(customer.name)} className="rounded-md bg-warning/10 px-2 py-1 text-xs font-medium text-warning transition-colors hover:bg-warning/20">Due</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader title="Collection Summary" description="Collected versus due amount over the last 7 days" count="This week" />
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-accent" />Collected</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-muted-foreground/30" />Due</span>
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_190px] lg:items-center">
          <div className="flex h-52 items-end gap-2 sm:gap-4">
            {collectionSummary.map((item) => (
              <div key={item.day} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center gap-1 rounded-lg bg-secondary/40 px-1 pt-2">
                  <div className="w-1/2 rounded-t-md bg-[#173b30] transition-all hover:opacity-80" style={{ height: `${Math.max((item.collected / maxCollection) * 100, 8)}%` }} title={`₹${item.collected.toLocaleString("en-IN")} collected`} />
                  <div className="w-1/2 rounded-t-md bg-muted-foreground/25 transition-all hover:bg-muted-foreground/40" style={{ height: `${Math.max((item.due / maxCollection) * 100, 8)}%` }} title={`₹${item.due.toLocaleString("en-IN")} due`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="rounded-xl bg-[#c4f36b] p-4"><p className="text-xs text-muted-foreground">Collected this week</p><p className="mt-1 text-xl font-semibold text-foreground">₹{collectionSummary.reduce((sum, item) => sum + item.collected, 0).toLocaleString("en-IN")}</p><p className="mt-1 text-xs font-medium text-accent-foreground">Strong collection trend</p></div>
            <div className="rounded-xl bg-secondary p-4"><p className="text-xs text-muted-foreground">Due today</p><p className="mt-1 text-xl font-semibold text-foreground">₹{totalDue.toLocaleString("en-IN")}</p><p className="mt-1 text-xs text-muted-foreground">{dueCustomers.length} customers pending</p></div>
          </div>
        </div>
      </section>

      {collectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="collection-dialog-title">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div><h2 id="collection-dialog-title" className="text-lg font-semibold text-foreground">Collect Payment</h2><p className="mt-1 text-sm text-muted-foreground">Record a customer payment for today.</p></div>
              <button type="button" onClick={() => setCollectionOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
            </div>
            <div className="mt-5 flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">Customer<div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={selectedCustomer} onChange={(event) => setSelectedCustomer(event.target.value)} placeholder="Search customer" className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none focus:border-accent" /></div></label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">Amount collected<input defaultValue="₹500" className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-accent" /></label>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">Payment method<select className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-accent" defaultValue="Cash"><option>Cash</option><option>UPI</option><option>Bank transfer</option></select></label>
            </div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setCollectionOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">Cancel</button><button type="button" onClick={() => setCollectionOpen(false)} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90">Confirm Payment</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

