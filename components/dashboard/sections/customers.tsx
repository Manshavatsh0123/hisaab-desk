"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Building2,
  Search,
  Plus,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  ExternalLink,
  Star,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const customers = [
  {
    id: 1,
    name: "Acme Corporation",
    industry: "Technology",
    tier: "Enterprise",
    location: "San Francisco, CA",
    contact: "John Smith",
    email: "john@acme.com",
    phone: "+1 (555) 123-4567",
    totalRevenue: 485000,
    activeDeals: 3,
    healthScore: 92,
    trend: "up",
    lastContact: "2 days ago",
    assignedStaff: "Rahul Kumar",
  },
  {
    id: 2,
    name: "GlobalTech Industries",
    industry: "Manufacturing",
    tier: "Enterprise",
    location: "New York, NY",
    contact: "Sarah Johnson",
    email: "sarah@globaltech.com",
    phone: "+1 (555) 234-5678",
    totalRevenue: 320000,
    activeDeals: 2,
    healthScore: 85,
    trend: "up",
    lastContact: "1 week ago",
    assignedStaff: "Priya Sharma",
  },
  {
    id: 3,
    name: "Innovate Labs",
    industry: "Healthcare",
    tier: "Growth",
    location: "Boston, MA",
    contact: "Michael Chen",
    email: "michael@innovatelabs.com",
    phone: "+1 (555) 345-6789",
    totalRevenue: 156000,
    activeDeals: 1,
    healthScore: 78,
    trend: "stable",
    lastContact: "3 days ago",
    assignedStaff: "Rahul Kumar",
  },
  {
    id: 4,
    name: "DataStream Analytics",
    industry: "Data Services",
    tier: "Growth",
    location: "Austin, TX",
    contact: "Emily Rodriguez",
    email: "emily@datastream.com",
    phone: "+1 (555) 456-7890",
    totalRevenue: 98000,
    activeDeals: 2,
    healthScore: 65,
    trend: "down",
    lastContact: "2 weeks ago",
    assignedStaff: "Amit Verma",
  },
  {
    id: 5,
    name: "NextGen Solutions",
    industry: "Finance",
    tier: "Starter",
    location: "Chicago, IL",
    contact: "David Park",
    email: "david@nextgen.com",
    phone: "+1 (555) 567-8901",
    totalRevenue: 45000,
    activeDeals: 1,
    healthScore: 88,
    trend: "up",
    lastContact: "Yesterday",
    assignedStaff: "Priya Sharma",
  },
  {
    id: 6,
    name: "CloudFirst Inc",
    industry: "Cloud Services",
    tier: "Enterprise",
    location: "Seattle, WA",
    contact: "Lisa Wang",
    email: "lisa@cloudfirst.com",
    phone: "+1 (555) 678-9012",
    totalRevenue: 275000,
    activeDeals: 4,
    healthScore: 95,
    trend: "up",
    lastContact: "Today",
    assignedStaff: "Rahul Kumar",
  },
];

const tierColors: Record<string, string> = {
  Enterprise: "bg-accent/20 text-accent border-accent/30",
  Growth: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  Starter: "bg-muted text-muted-foreground border-border",
};

export function CustomersSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [frequency, setFrequency] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof customers)[number] | null>(null);

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = `${customer.name} ${customer.contact} ${customer.id}`.toLowerCase().includes(query);
    return matchesSearch && (!selectedTier || customer.tier === selectedTier);
  });
  const totalRevenue = customers.reduce((total, customer) => total + customer.totalRevenue, 0);
  const avgHealthScore = Math.round(customers.reduce((total, customer) => total + customer.healthScore, 0) / customers.length);
  const activeDeals = customers.reduce((total, customer) => total + customer.activeDeals, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Customer workspace</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">A clear view of every relationship, account owner, and customer signal.</p>
        </div>
        <Button className="w-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 sm:w-auto"><Plus data-icon="inline-start" /> Add Customer</Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard title="Total Customers" value={String(customers.length)} change="Active customers" changeType="neutral" icon={Building2} delay={0} />
        <MetricCard title="Paid This Period" value={`$${(totalRevenue / 1000000).toFixed(2)}M`} change="Collections completed" changeType="positive" icon={DollarSign} delay={1} />
        <MetricCard title="Expected Collection" value={`$${((totalRevenue + activeDeals * 25000) / 1000000).toFixed(2)}M`} change="Total expected" changeType="neutral" icon={TrendingUp} delay={2} />
      </div>

      <Card className="overflow-hidden rounded-2xl border-border/70 bg-card shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b border-border/70 bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-2"><CardTitle className="text-base">All customers</CardTitle><Badge variant="secondary" className="bg-accent text-accent-foreground">{filteredCustomers.length}</Badge></div>
          <div className="grid w-full gap-2 sm:grid-cols-[minmax(220px,1fr)_150px_150px_auto] sm:items-center">
            <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search customer, ID, phone or account..." className="border-border bg-secondary/70 pl-9" /></div>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}><SelectTrigger className="border-border bg-secondary/70"><SelectValue placeholder="Payment Status" /></SelectTrigger><SelectContent><SelectItem value="all">Payment Status</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="due">Due</SelectItem><SelectItem value="overdue">Overdue</SelectItem><SelectItem value="not-due">Not Due</SelectItem><SelectItem value="matured">Matured</SelectItem></SelectContent></Select>
            <Select value={frequency} onValueChange={setFrequency}><SelectTrigger className="border-border bg-secondary/70"><SelectValue placeholder="Frequency" /></SelectTrigger><SelectContent><SelectItem value="all">Frequency</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="quarterly">Quarterly</SelectItem><SelectItem value="half-yearly">Half-Yearly</SelectItem><SelectItem value="yearly">Yearly</SelectItem><SelectItem value="one-time">One-Time</SelectItem></SelectContent></Select>
            <Button className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"><Plus data-icon="inline-start" /> Add Collection</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-3 p-4 md:hidden">
            {filteredCustomers.map((customer) => <CustomerCard key={customer.id} customer={customer} onView={setSelectedCustomer} />)}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[980px] text-sm"><thead><tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground"><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Assigned staff</th><th className="px-5 py-3">Tier</th><th className="px-5 py-3">Revenue</th><th className="px-5 py-3">Health</th><th className="px-5 py-3">Deals</th><th className="px-5 py-3">Actions</th></tr></thead><tbody>{filteredCustomers.map((customer) => <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/30"><td className="px-5 py-4"><button onClick={() => setSelectedCustomer(customer)} className="text-left"><p className="font-medium text-foreground hover:text-accent">{customer.name}</p><p className="text-xs text-muted-foreground">CUS-{String(customer.id).padStart(4, "0")} · {customer.industry}</p></button></td><td className="px-5 py-4"><p className="text-foreground">{customer.contact}</p><p className="text-xs text-muted-foreground">{customer.email}</p></td><td className="px-5 py-4 text-muted-foreground">{customer.assignedStaff}</td><td className="px-5 py-4"><Badge className={`${tierColors[customer.tier]} border`}>{customer.tier}</Badge></td><td className="px-5 py-4 font-medium text-foreground">${customer.totalRevenue.toLocaleString()}</td><td className="px-5 py-4"><span className={customer.healthScore >= 80 ? "font-medium text-accent" : customer.healthScore >= 60 ? "font-medium text-chart-3" : "font-medium text-destructive"}>{customer.healthScore}%</span></td><td className="px-5 py-4 text-muted-foreground">{customer.activeDeals}</td><td className="px-5 py-4"><Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)}><ExternalLink data-icon="inline-start" /> View</Button></td></tr>)}</tbody></table>
          </div>
          {filteredCustomers.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">No customers found.</p>}
        </CardContent>
      </Card>
      {selectedCustomer && <CustomerDetail customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
    </div>
  );
}

function CustomerCard({ customer, onView }: { customer: (typeof customers)[number]; onView: (customer: (typeof customers)[number]) => void }) {
  const initials = customer.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  return <Card className="group border-border bg-card transition-all duration-300 hover:border-accent/50"><CardContent className="p-5"><div className="mb-4 flex items-start justify-between"><div className="flex items-center gap-3"><Avatar className="size-12 bg-secondary"><AvatarFallback className="bg-secondary font-semibold text-foreground">{initials}</AvatarFallback></Avatar><div><button onClick={() => onView(customer)} className="font-semibold text-foreground transition-colors hover:text-accent">{customer.name}</button><p className="text-sm text-muted-foreground">CUS-{String(customer.id).padStart(4, "0")} · {customer.industry}</p></div></div><Badge className={`${tierColors[customer.tier]} border`}>{customer.tier}</Badge></div><div className="mb-4 grid gap-2 text-sm text-muted-foreground"><div className="flex items-center gap-2"><MapPin className="size-3.5" />{customer.location}</div><div className="flex items-center gap-2"><Mail className="size-3.5" />{customer.email}</div><div className="flex items-center gap-2"><Phone className="size-3.5" />{customer.phone}</div></div><div className="mb-4 grid grid-cols-2 gap-4"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Revenue</span><span className="font-medium text-foreground">${customer.totalRevenue.toLocaleString()}</span></div><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Deals</span><span className="font-medium text-foreground">{customer.activeDeals}</span></div><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Staff</span><span className="font-medium text-foreground">{customer.assignedStaff}</span></div><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Last contact</span><span className="font-medium text-foreground">{customer.lastContact}</span></div></div><div className="flex items-center justify-between border-t border-border pt-4"><div className="flex items-center gap-2 text-sm text-muted-foreground">Health <span className="font-semibold text-accent">{customer.healthScore}%</span></div><Button variant="outline" size="sm" onClick={() => onView(customer)}><ExternalLink data-icon="inline-start" /> View details</Button></div></CardContent></Card>;
}

function CustomerDetail({ customer, onClose }: { customer: (typeof customers)[number]; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-end bg-slate-900/20"><div className="h-full w-full max-w-lg overflow-y-auto border-l border-border bg-card p-6 shadow-xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">Customer profile</p><h2 className="mt-1 text-2xl font-semibold text-foreground">{customer.name}</h2><p className="mt-1 text-sm text-muted-foreground">CUS-{String(customer.id).padStart(4, "0")} · {customer.industry}</p></div><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close customer details"><ExternalLink /></Button></div><div className="mt-6 flex flex-wrap items-center gap-2"><Badge className={`${tierColors[customer.tier]} border`}>{customer.tier}</Badge><Badge variant="outline">{customer.assignedStaff}</Badge></div><div className="mt-8 grid grid-cols-2 gap-3">{[["Total revenue", `$${customer.totalRevenue.toLocaleString()}`], ["Active deals", String(customer.activeDeals)], ["Health score", `${customer.healthScore}%`], ["Last contact", customer.lastContact]].map(([label, value]) => <div key={label} className="rounded-xl border border-border bg-muted/20 p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold text-foreground">{value}</p></div>)}</div><div className="mt-8 rounded-xl border border-border p-4"><p className="text-sm font-semibold text-foreground">Contact details</p><div className="mt-3 grid gap-2 text-sm text-muted-foreground"><span>{customer.contact}</span><span>{customer.email}</span><span>{customer.phone}</span><span>{customer.location}</span></div></div></div></div>;
}
