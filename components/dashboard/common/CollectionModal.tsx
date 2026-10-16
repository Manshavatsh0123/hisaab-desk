
"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  LoaderCircle,
  Search,
  ShieldCheck,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import {
  useLazyListCustomersQuery,
  useLazyGetCustomerDetailsQuery,
  useAddAdminCollectionMutation,
  type CustomerRecord,
  type AccountRecord,
} from "@/features/customers/customersApi";

type CollectionModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const formatMoney = (value: number | string) =>
  `₹${(Number(value) || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const value = error as {
      data?: { message?: string };
      error?: string;
      message?: string;
    };

    return (
      value.data?.message ||
      value.message ||
      value.error ||
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
}

function getToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function CollectionModal({
  open,
  onClose,
  onSuccess,
}: CollectionModalProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerRecord | null>(null);
  const [selectedAccount, setSelectedAccount] =
    useState<AccountRecord | null>(null);

  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(getToday());
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const idempotencyKeyRef = useRef("");

  const [
    searchCustomers,
    {
      data: customerList,
      isFetching: searchingCustomers,
      error: customerSearchError,
    },
  ] = useLazyListCustomersQuery();

  const [
    fetchCustomerDetails,
    {
      data: customerDetails,
      isFetching: loadingDetails,
      error: customerDetailsError,
    },
  ] = useLazyGetCustomerDetailsQuery();

  const [
    addAdminCollection,
    { isLoading: submitting },
  ] = useAddAdminCollectionMutation();

  
  useEffect(() => {
    if (!open) return;

    const query = searchText.trim();

    if (query.length < 2 || selectedCustomer) return;

    const timer = setTimeout(() => {
      void searchCustomers({
        search: query,
        page: 1,
        limit: 10,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [open, searchText, selectedCustomer, searchCustomers]);

  // Always reset temporary modal data when it closes.
  useEffect(() => {
    if (open) return;

    setSearchText("");
    setSelectedCustomer(null);
    setSelectedAccount(null);
    setAmount("");
    setPaymentDate(getToday());
    setReferenceNumber("");
    setNotes("");
    setFormError("");
    setSuccessMessage("");
    idempotencyKeyRef.current = "";
  }, [open]);

  if (!open) return null;

  const availableAccounts = (customerDetails?.accounts ?? []).filter(
    (account) => account.status?.toUpperCase() === "ACTIVE"
  );

  const searchResults = (customerList?.customers ?? []).filter(
    (customer) => customer.status?.toUpperCase() !== "INACTIVE"
  );

  function chooseCustomer(customer: CustomerRecord) {
    setSelectedCustomer(customer);
    setSearchText(customer.full_name);
    setSelectedAccount(null);
    setAmount("");
    setFormError("");
    setSuccessMessage("");
    idempotencyKeyRef.current = "";

    // Use the database customer ID to fetch its account details.
    void fetchCustomerDetails(customer.id);
  }

  function changeCustomerSearch(value: string) {
    setSearchText(value);
    setSelectedCustomer(null);
    setSelectedAccount(null);
    setAmount("");
    setFormError("");
    setSuccessMessage("");
    idempotencyKeyRef.current = "";
  }

  function chooseAccount(account: AccountRecord) {
    setSelectedAccount(account);
    setAmount(String(Number(account.collection_amount) || ""));
    setFormError("");
    setSuccessMessage("");
    idempotencyKeyRef.current = "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    if (!selectedCustomer) {
      setFormError("Please search for and select a customer.");
      return;
    }

    if (!selectedAccount) {
      setFormError("Please select an account for this customer.");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setFormError("Enter a collection amount greater than ₹0.");
      return;
    }

    if (!paymentDate || Number.isNaN(Date.parse(paymentDate))) {
      setFormError("Please select a valid payment date.");
      return;
    }

    if (
      selectedAccount.customer_id !== selectedCustomer.id
    ) {
      setFormError(
        "The selected account does not belong to this customer."
      );
      return;
    }

    setFormError("");
    setSuccessMessage("");

    // Reuse the same key if this submission is retried after an uncertain
    // network result. The backend must support Idempotency-Key.
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID();
    }

    try {
      const response = await addAdminCollection({
        customerId: selectedCustomer.id,
        accountId: selectedAccount.id,
        amount: numericAmount,
        payment_date: paymentDate,
        reference_number: referenceNumber.trim() || undefined,
        notes: notes.trim() || undefined,
        idempotencyKey: idempotencyKeyRef.current,
      }).unwrap();

      if (!response.success) {
        throw new Error(
          response.message || "Collection could not be saved."
        );
      }

      setSuccessMessage(
        `Collection of ${formatMoney(numericAmount)} recorded successfully.`
      );

      onSuccess?.();

      // Briefly display success before closing.
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#172337]/45 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-dialog-title"
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100dvh-32px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[var(--hs-border)] bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--hs-border)] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--hs-primary)] text-white">
              <CreditCard className="size-5" />
            </div>

            <div>
              <h2
                id="collection-dialog-title"
                className="text-lg font-bold text-[var(--hs-text)]"
              >
                Add collection
              </h2>
              <p className="text-xs text-[var(--hs-text-secondary)]">
                Find a customer, choose their account, and record payment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close collection dialog"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-[var(--hs-text-secondary)] transition hover:bg-[var(--hs-background)] disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {formError && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-lg border border-[var(--hs-primary-border)] bg-[var(--hs-danger-light)] p-3 text-sm text-[var(--hs-danger)]"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{formError}</p>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--hs-border)] bg-[var(--hs-success-light)] p-3 text-sm text-[var(--hs-success)]"
            >
              <CheckCircle2 className="size-4 shrink-0" />
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
            {/* Customer and account selection */}
            <div className="space-y-4 lg:col-span-7">
              <section className="rounded-lg border border-[var(--hs-border)] p-4">
                <label
                  htmlFor="collection-customer-search"
                  className="mb-2 block text-sm font-semibold text-[var(--hs-text)]"
                >
                  Search customer
                  <span className="ml-1 text-[var(--hs-primary)]">*</span>
                </label>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--hs-text-muted)]" />

                  <input
                    id="collection-customer-search"
                    value={searchText}
                    onChange={(event) =>
                      changeCustomerSearch(event.target.value)
                    }
                    placeholder="Enter name, phone or customer code"
                    autoComplete="off"
                    className="h-11 w-full rounded-lg border border-[var(--hs-border)] bg-white pl-9 pr-10 text-sm text-[var(--hs-text)] outline-none focus:border-[var(--hs-primary)] focus:ring-2 focus:ring-[var(--hs-primary-light)]"
                  />

                  {searchingCustomers && (
                    <LoaderCircle className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-[var(--hs-primary)]" />
                  )}
                </div>

                {!selectedCustomer &&
                  searchText.trim().length >= 2 && (
                    <div className="mt-2 overflow-hidden rounded-lg border border-[var(--hs-border)]">
                      {customerSearchError ? (
                        <p className="p-3 text-sm text-[var(--hs-danger)]">
                          {getErrorMessage(customerSearchError)}
                        </p>
                      ) : searchingCustomers ? (
                        <p className="p-3 text-sm text-[var(--hs-text-secondary)]">
                          Searching customers...
                        </p>
                      ) : searchResults.length > 0 ? (
                        <div className="max-h-52 overflow-y-auto">
                          {searchResults.map((customer) => (
                            <button
                              key={customer.id}
                              type="button"
                              onClick={() => chooseCustomer(customer)}
                              className="flex w-full items-center gap-3 border-b border-[var(--hs-border-light)] p-3 text-left last:border-b-0 hover:bg-[var(--hs-background)]"
                            >
                              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--hs-primary-light)] text-sm font-bold text-[var(--hs-primary)]">
                                {customer.full_name
                                  .trim()
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-[var(--hs-text)]">
                                  {customer.full_name}
                                </span>
                                <span className="mt-0.5 block text-xs text-[var(--hs-text-secondary)]">
                                  {customer.phone || "No phone"}
                                  {customer.customer_code
                                    ? ` · ${customer.customer_code}`
                                    : ""}
                                </span>
                              </span>

                              <span className="text-xs font-semibold text-[var(--hs-primary)]">
                                Select
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="p-3 text-sm text-[var(--hs-text-secondary)]">
                          No matching customers found.
                        </p>
                      )}
                    </div>
                  )}

                <p className="mt-2 text-xs text-[var(--hs-text-muted)]">
                  Enter at least two characters, then select the correct customer.
                </p>
              </section>

              {/* Selected customer */}
              {selectedCustomer && (
                <section className="overflow-hidden rounded-lg border border-[var(--hs-border)]">
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--hs-border)] bg-[var(--hs-background)] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserRound className="size-4 text-[var(--hs-primary)]" />
                      <h3 className="text-sm font-semibold text-[var(--hs-text)]">
                        Selected customer
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => changeCustomerSearch("")}
                      className="text-xs font-semibold text-[var(--hs-primary)] hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex items-center gap-3 p-4">
                    <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--hs-primary-light)] font-bold text-[var(--hs-primary)]">
                      {selectedCustomer.full_name
                        .trim()
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[var(--hs-text)]">
                        {selectedCustomer.full_name}
                      </p>
                      <p className="mt-1 text-xs text-[var(--hs-text-secondary)]">
                        {selectedCustomer.phone || "No phone number"}
                      </p>
                      {selectedCustomer.customer_code && (
                        <p className="mt-1 text-xs text-[var(--hs-text-muted)]">
                          {selectedCustomer.customer_code}
                        </p>
                      )}
                    </div>

                    {loadingDetails && (
                      <LoaderCircle className="size-5 animate-spin text-[var(--hs-primary)]" />
                    )}
                  </div>

                  {customerDetailsError && (
                    <div className="border-t border-[var(--hs-border)] p-3 text-sm text-[var(--hs-danger)]">
                      {getErrorMessage(customerDetailsError)}
                      <button
                        type="button"
                        onClick={() =>
                          void fetchCustomerDetails(selectedCustomer.id)
                        }
                        className="ml-2 font-semibold underline"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </section>
              )}

              {/* Accounts from the selected customer's details API */}
              {selectedCustomer && !loadingDetails && (
                <section className="rounded-lg border border-[var(--hs-border)] p-4">
                  <label
                    htmlFor="collection-account"
                    className="mb-2 block text-sm font-semibold text-[var(--hs-text)]"
                  >
                    Select customer account
                    <span className="ml-1 text-[var(--hs-primary)]">*</span>
                  </label>

                  {availableAccounts.length === 0 ? (
                    <p className="rounded-lg bg-[var(--hs-background)] p-3 text-sm text-[var(--hs-text-secondary)]">
                      {customerDetails
                        ? "This customer has no active accounts available for collection."
                        : "Customer account details have not loaded yet."}
                    </p>
                  ) : (
                    <>
                      <div className="relative">
                        <select
                          id="collection-account"
                          value={selectedAccount?.id ?? ""}
                          onChange={(event) => {
                            const account = availableAccounts.find(
                              (item) => item.id === event.target.value
                            );
                            if (account) chooseAccount(account);
                          }}
                          className="h-11 w-full appearance-none rounded-lg border border-[var(--hs-border)] bg-white px-3 pr-9 text-sm text-[var(--hs-text)] outline-none focus:border-[var(--hs-primary)] focus:ring-2 focus:ring-[var(--hs-primary-light)]"
                        >
                          <option value="">Choose an account</option>
                          {availableAccounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.account_number} —{" "}
                              {account.account_name || account.scheme} (
                              {formatMoney(account.collection_amount)})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--hs-text-muted)]" />
                      </div>

                      {selectedAccount && (
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div className="rounded-lg bg-[var(--hs-background)] p-3">
                            <p className="text-xs text-[var(--hs-text-secondary)]">
                              Account number
                            </p>
                            <p className="mt-1 break-words text-sm font-bold text-[var(--hs-text)]">
                              {selectedAccount.account_number}
                            </p>
                          </div>

                          <div className="rounded-lg bg-[var(--hs-background)] p-3">
                            <p className="text-xs text-[var(--hs-text-secondary)]">
                              Scheme
                            </p>
                            <p className="mt-1 text-sm font-bold text-[var(--hs-text)]">
                              {selectedAccount.scheme || "—"}
                            </p>
                          </div>

                          <div className="rounded-lg border border-[var(--hs-border)] p-3">
                            <p className="text-xs text-[var(--hs-text-secondary)]">
                              Installment amount
                            </p>
                            <p className="mt-1 text-base font-bold text-[var(--hs-text)]">
                              {formatMoney(selectedAccount.collection_amount)}
                            </p>
                          </div>

                          <div className="rounded-lg border border-[var(--hs-border)] p-3">
                            <p className="text-xs text-[var(--hs-text-secondary)]">
                              Frequency
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[var(--hs-text)]">
                              {selectedAccount.frequency || "—"}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}
            </div>

            {/* Collection details */}
            <div className="space-y-4 lg:col-span-5">
              <section className="rounded-lg border border-[var(--hs-border)] p-4">
                <div className="flex items-center gap-2">
                  <Wallet className="size-4 text-[var(--hs-primary)]" />
                  <h3 className="text-sm font-semibold text-[var(--hs-text)]">
                    Collection details
                  </h3>
                </div>

                <label
                  htmlFor="collection-amount"
                  className="mb-2 mt-4 block text-sm font-semibold text-[var(--hs-text)]"
                >
                  Collection amount
                  <span className="ml-1 text-[var(--hs-primary)]">*</span>
                </label>

                <div className="flex h-14 items-center overflow-hidden rounded-lg border border-[var(--hs-border)] focus-within:border-[var(--hs-primary)] focus-within:ring-2 focus-within:ring-[var(--hs-primary-light)]">
                  <span className="flex h-full items-center border-r border-[var(--hs-border)] bg-[var(--hs-background)] px-4 text-lg font-semibold text-[var(--hs-text-secondary)]">
                    ₹
                  </span>
                  <input
                    id="collection-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                      setFormError("");
                    }}
                    placeholder="Enter amount"
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-xl font-bold text-[var(--hs-text)] outline-none"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-[var(--hs-text-muted)]">
                  The amount is prefilled from the account installment. Adjust it to match the amount actually received.
                </p>

                <label
                  htmlFor="collection-date"
                  className="mb-2 mt-4 block text-sm font-semibold text-[var(--hs-text)]"
                >
                  Payment date
                  <span className="ml-1 text-[var(--hs-primary)]">*</span>
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--hs-text-muted)]" />
                  <input
                    id="collection-date"
                    type="date"
                    value={paymentDate}
                    max={getToday()}
                    onChange={(event) =>
                      setPaymentDate(event.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-[var(--hs-border)] bg-white pl-9 pr-3 text-sm text-[var(--hs-text)] outline-none focus:border-[var(--hs-primary)]"
                  />
                </div>

                <label
                  htmlFor="collection-reference"
                  className="mb-2 mt-4 block text-sm font-semibold text-[var(--hs-text)]"
                >
                  Reference number
                  <span className="ml-1 font-normal text-[var(--hs-text-muted)]">
                    (optional)
                  </span>
                </label>
                <input
                  id="collection-reference"
                  value={referenceNumber}
                  onChange={(event) =>
                    setReferenceNumber(event.target.value)
                  }
                  maxLength={100}
                  placeholder="Receipt or transaction reference"
                  className="h-11 w-full rounded-lg border border-[var(--hs-border)] px-3 text-sm text-[var(--hs-text)] outline-none focus:border-[var(--hs-primary)]"
                />

                <label
                  htmlFor="collection-notes"
                  className="mb-2 mt-4 block text-sm font-semibold text-[var(--hs-text)]"
                >
                  Notes
                  <span className="ml-1 font-normal text-[var(--hs-text-muted)]">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="collection-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Add any collection notes"
                  className="w-full resize-y rounded-lg border border-[var(--hs-border)] p-3 text-sm text-[var(--hs-text)] outline-none focus:border-[var(--hs-primary)]"
                />
              </section>

              <div className="flex items-start gap-3 rounded-lg border border-[var(--hs-primary-border)] bg-[var(--hs-primary-light)] p-3.5">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--hs-primary)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--hs-text)]">
                    Verify collection details
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--hs-text-secondary)]">
                    Confirm the customer, account, amount, and payment date before saving. Admin collections are recorded as approved by your backend.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[var(--hs-border)] bg-white px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="h-10 rounded-lg border border-[var(--hs-border)] px-5 text-sm font-semibold text-[var(--hs-text-secondary)] transition hover:bg-[var(--hs-background)] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              submitting ||
              !selectedCustomer ||
              !selectedAccount ||
              !amount ||
              !Number.isFinite(Number(amount)) ||
              Number(amount) <= 0 ||
              availableAccounts.length === 0
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--hs-primary)] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hs-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            {submitting ? "Saving collection..." : "Add Collection"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CollectionModal;
