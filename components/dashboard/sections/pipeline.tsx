"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, ArrowLeft, CalendarDays, Check, CheckCircle2, ChevronDown, Eye, EyeOff, LockKeyhole, Plus, Trash2, UserRound, WalletCards } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useCreateCustomerMutation, useCreateAccountMutation, useLazyGetCustomerDetailsQuery, type CustomerDetailsResponse,
} from "@/features/customers/customersApi";

const frequencyOptions = [
  "Daily",
  "Weekly",
  "Monthly",
];

const schemeOptions = [
  "RD",
  "PPF",
  "TD",
  "MIS",
  "NSC",
  "Other",
];

type Account = {
  accountName: string;
  accountNumber: string;
  schemeType: string;
  maturityName: string;
  collectionAmount: string;
  frequency: string;
  startDate: string;
  maturityDate: string;
  previousCollection: string;
  targetAmount: string;
};

type Customer = {
  name: string;
  phone: string;
  alternatePhone: string;
  aadharNumber: string;
  panNumber: string;
  nomineeName: string;
  username: string;
  password: string;
};

type CustomerField = keyof Customer;
type CustomerErrors = Partial<Record<CustomerField, string>>;
type AccountErrors = Partial<Record<keyof Account, string>>;
const emptyAccount = (): Account => ({
  accountName: "",
  accountNumber: "",
  schemeType: "",
  maturityName: "",
  collectionAmount: "",
  frequency: "Monthly",
  startDate: "",
  maturityDate: "",
  previousCollection: "0",
  targetAmount: "",
});

const emptyCustomer = (): Customer => ({
  name: "",
  phone: "",
  alternatePhone: "",
  aadharNumber: "",
  panNumber: "",
  nomineeName: "",
  username: "",
  password: "",
});

function getApiErrorMessage(error: unknown): string {
  const value = error as {
    data?: { message?: string; error?: string };
    message?: string;
    status?: string | number;
  };
  if (value?.data?.message) return value.data.message;
  if (value?.data?.error) return value.data.error;
  if (value?.status === 401) {
    return "Unauthorized (401). Please log in again and verify the saved access token.";
  }
  if (value?.status === 403) {
    return "Access denied. Verify that your account has the required ADMIN role.";
  }
  if (value?.status === "FETCH_ERROR") {
    return "Cannot connect to the backend. Check that the API server is running.";
  }
  return value?.message || "Request failed. Please try again.";
}

export function PipelineSection() {

  const [customer, setCustomer] = useState<Customer>(emptyCustomer(),);

  const [accounts, setAccounts] = useState<Account[]>([emptyAccount(),]);

  const [customerErrors, setCustomerErrors] = useState<CustomerErrors>({});
  const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateCustomerMutation();
  const [createAccount, { isLoading: isCreatingAccount }] = useCreateAccountMutation();
  const [fetchCustomerDetails, { isFetching: isFetchingDetails }] =
    useLazyGetCustomerDetailsQuery();
  const [createdCustomerId, setCreatedCustomerId] = useState<string | null>(null);
  const [savedCustomerDetails, setSavedCustomerDetails] =
    useState<CustomerDetailsResponse | null>(null);
  const [apiError, setApiError] = useState("");
  const [accountErrors, setAccountErrors] = useState<AccountErrors[]>([{}]);

  const [success, setSuccess] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [setupStep, setSetupStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);

  const updateCustomer = (
    field: CustomerField,
    value: string,
  ) => {

    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));

    setCustomerErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });

    setSuccess("");
  };

  const updateAccount = (
    index: number,
    field: keyof Account,
    value: string,

  ) => {

    setAccounts((current) =>

      current.map((account, accountIndex) =>

        accountIndex === index

          ? {
            ...account,
            [field]: value,
          }
          : account,
      ),
    );

    setAccountErrors((current) => {
      const next = [...current];
      while (next.length < accounts.length) {
        next.push({});
      }

      if (next[index]?.[field]) {
        next[index] = {
          ...next[index],
        };
        delete next[index][field];
      }
      return next;
    });
    setSuccess("");
  };

  const validateCustomer = (): CustomerErrors => {
    const nextErrors: CustomerErrors = {};

    if (!customer.name.trim()) {
      nextErrors.name = "Customer name is required.";
    }

    if (!/^\d{10}$/.test(customer.phone)) {
      nextErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (customer.alternatePhone && !/^\d{10}$/.test(customer.alternatePhone)) {
      nextErrors.alternatePhone = "Enter a valid 10-digit alternate phone number.";
    }

    if (customer.aadharNumber && !/^\d{12}$/.test(customer.aadharNumber)) {
      nextErrors.aadharNumber = "Aadhaar must contain exactly 12 digits.";
    }

    if (customer.panNumber && !/^[A-Z]{5}\d{4}[A-Z]$/.test(customer.panNumber.toUpperCase())) {
      nextErrors.panNumber = "Enter a valid PAN, e.g. ABCDE1234F.";
    }

    if (!customer.username.trim()) {
      nextErrors.username = "Username is required.";
    }

    if (customer.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    return nextErrors;
  };

  const validateAccounts = (): AccountErrors[] => {

    const nextErrors: AccountErrors[] = accounts.map(() => ({}),);

    accounts.forEach((account, index) => {

      if (!account.accountName.trim()) {
        nextErrors[index].accountName =
          "Account name is required.";
      }

      if (!account.accountNumber.trim()) {
        nextErrors[index].accountNumber =
          "Account number is required.";
      }

      if (!account.schemeType) {

        nextErrors[index].schemeType =
          "Please select a scheme.";
      }

      if (

        !account.collectionAmount ||
        Number(account.collectionAmount) <= 0
      ) {

        nextErrors[index].collectionAmount =
          "Enter an amount greater than ₹0.";
      }

      if (!account.startDate) {
        nextErrors[index].startDate =
          "Start date is required.";
      }

      if (
        account.startDate &&
        account.maturityDate &&
        account.maturityDate < account.startDate
      ) {

        nextErrors[index].maturityDate =
          "Maturity date must be after start date.";
      }

    });
    return nextErrors;
  };

  const hasCustomerErrors = (
    errors: CustomerErrors,
  ) => Object.keys(errors).length > 0;

  const hasAccountErrors = (
    errors: AccountErrors[],
  ) =>
    errors.some(
      (error) => Object.keys(error).length > 0,
    );

  const goNext = async () => {
    if (isSubmitting || isCreatingCustomer || isCreatingAccount || isFetchingDetails) return;

    setSuccess("");
    setApiError("");

    if (setupStep === 1) {
      const nextErrors = validateCustomer();
      setCustomerErrors(nextErrors);
      if (hasCustomerErrors(nextErrors)) return;

      setIsSubmitting(true);
      try {
        const response = await createCustomer({
          full_name: customer.name.trim(),
          phone: customer.phone.trim(),
          alternate_phone: customer.alternatePhone.trim(),
          aadhaar_number: customer.aadharNumber.trim(),
          pan_number: customer.panNumber.trim().toUpperCase(),
          nominee_name: customer.nomineeName.trim(),
          username: customer.username.trim().toLowerCase(),
          password: customer.password,
        }).unwrap();

        if (!response.success || !response.customer?.id) {
          throw new Error(response.message || "Customer creation was not confirmed.");
        }

        const customerId = response.customer.id;
        setCreatedCustomerId(customerId);
        setSavedCustomerDetails(null);
        setCustomerErrors({});
        setSuccess(`Customer created successfully. Customer ID: ${customerId}`);
        setSetupStep(2);
      } catch (error: unknown) {
        setApiError(getApiErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (setupStep === 2) {
      const nextErrors = validateAccounts();
      setAccountErrors(nextErrors);
      if (hasAccountErrors(nextErrors)) return;

      if (!createdCustomerId) {
        setApiError("Customer ID is missing. Please create the customer first.");
        setSetupStep(1);
        return;
      }

      setIsSubmitting(true);
      try {
        for (let index = 0; index < accounts.length; index += 1) {
          const account = accounts[index];
          const response = await createAccount({
            customerId: createdCustomerId,
            body: {
              account_number: account.accountNumber.trim(),
              scheme: account.schemeType,
              account_name: account.accountName.trim(),
              collection_amount: Number(account.collectionAmount),
              frequency: account.frequency.toUpperCase(),
              start_date: account.startDate,
              maturity_date: account.maturityDate || null,
              previous_paid: Number(account.previousCollection || 0),
            },
          }).unwrap();

          if (!response.success || !response.account?.id) {
            throw new Error(
              response.message || `Account ${index + 1} creation was not confirmed.`
            );
          }
        }

        const details = await fetchCustomerDetails(createdCustomerId, true).unwrap();
        if (!details.success || !details.customer) {
          throw new Error("Customer was saved, but the details could not be fetched.");
        }

        setSavedCustomerDetails(details);
        setAccountErrors(accounts.map(() => ({})));
        setSuccess("Customer and account details saved successfully.");
        setSetupStep(3);
      } catch (error: unknown) {
        setApiError(getApiErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const goBack = () => {
    setCustomerErrors({});
    setAccountErrors(accounts.map(() => ({})));
    setSuccess("");
    setSetupStep((current) =>
      Math.max(1, current - 1),
    );
  };

  const addAccount = () => {

    setAccounts((current) => [
      ...current,
      emptyAccount(),
    ]);

    setAccountErrors((current) => [
      ...current,
      {},
    ]);
    setSuccess("");
  };

  const removeAccount = (index: number) => {

    setAccounts((current) =>
      current.filter(
        (_, accountIndex) =>
          accountIndex !== index,
      ),
    );

    setAccountErrors((current) =>
      current.filter(
        (_, accountIndex) =>
          accountIndex !== index,
      ),
    );

    setSuccess("");

  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!savedCustomerDetails) {
      setApiError("Please save and review the customer and account details before finishing.");
      return;
    }

    // The customer and accounts have already been created by the API in steps 1 and 2.
    // This button completes the local workflow and prepares the form for the next customer.
    setApiError("");
    setSuccess("Customer onboarding completed successfully. You can add another customer now.");
    setCustomer(emptyCustomer());
    setAccounts([emptyAccount()]);
    setCustomerErrors({});
    setAccountErrors([{}]);
    setCreatedCustomerId(null);
    setSavedCustomerDetails(null);
    setSetupStep(1);
    setShowPassword(false);
  };

  return (

    <div className="mx-auto w-full min-w-0">

      <div className="min-w-0 px-[var(--hs-page-padding-x)] py-[var(--hs-page-padding-y)] max-sm:px-3 max-sm:py-4">

        <div className="mb-5 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--hs-text-secondary)]">Overview /  Add Customer</p>

              <h2 className="text-2xl font-bold tracking-tight text-[var(--hs-text)] sm:text-4xl">

                Customer{" "}

                <span className="inline-block bg-[var(--hs-primary-light)] px-2 text-[var(--hs-primary)]">creation.</span>

              </h2>

              <p className="mt-2 text-sm text-[var(--hs-text-secondary)]"> Create a customer profile and add collection

                accounts.</p>

            </div>

          </div>

          <div className="flex w-full min-w-0 overflow-x-auto rounded-lg border border-[var(--hs-border)] bg-white p-1 shadow-sm lg:w-auto">

            {[

              "Guided setup",

              "Account info",

              "Review",

            ].map((item, index) => {

              const active = setupStep === index + 1;

              const completed = setupStep > index + 1;

              return (

                <button
                  key={item}
                  type="button"
                  disabled={!completed && !active}
                  onClick={() => {

                    if (completed || active) {
                      setSetupStep(index + 1);
                    }
                  }}

                  className={`min-w-0 flex-1 whitespace-nowrap rounded-md px-2 py-2 text-[11px] font-bold transition sm:px-4 sm:text-xs ${active ? "bg-[var(--hs-primary)] text-white" : completed ? "text-[var(--hs-text)] hover:bg-[var(--hs-hover)]" : "text-[var(--hs-text-muted)]"} `}>

                  <span className="mr-1 opacity-50">
                    0{index + 1}
                  </span>

                  <span className="sm:hidden">{index === 0 ? "Customer" : index === 1 ? "Accounts" : "Review"}</span>
                  <span className="hidden sm:inline">{item}</span>
                </button>

              );

            })}

          </div>

        </div>

        <div className="mb-3 flex min-w-0 items-center justify-between gap-2">

          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--hs-text-muted)]">
            Customer onboarding
          </p>

          <div className="hidden items-center gap-1.5 text-xs font-semibold text-[var(--hs-success)] sm:flex">

            <Check className="size-3.5" />
            Dashboard style matched
          </div>

        </div>

        <div className="grid min-w-0 overflow-hidden rounded-xl border border-[var(--hs-border)] bg-white shadow-[0_2px_10px_rgba(23,59,48,0.04)] lg:grid-cols-[190px_1fr]">

          <aside className="hidden bg-[var(--hs-background)] p-5 lg:block">

            <p className="text-xs font-bold uppercase tracking-wide text-[var(--hs-text-secondary)]">
              New customer
            </p>

            <h2 className="mt-1.5 text-xl font-bold text-[var(--hs-text)]">
              Account setup
            </h2>

            <ol className="mt-7 space-y-5">

              {[
                "Customer details",
                "Account info",
                "Review account",
              ].map((step, index) => {

                const active = setupStep === index + 1;
                const completed = setupStep > index + 1;

                return (

                  <li
                    key={step}
                    className="flex items-center gap-3"
                  >

                    <span
                      className={` grid size-6 shrink-0 place-items-center rounded-full text-sm font-bold ${active ? "bg-[var(--hs-primary)] text-[var(--hs-text)]" : completed   ? "bg-[var(--hs-primary)] text-white"   : "border border-[var(--hs-border)] bg-white text-[var(--hs-text-muted)]" }`}
                    >

                      {completed ? (
                        <Check className="size-4" />
                      ) : (

                        index + 1

                      )}

                    </span>

                    <span

                      className={`text-[13px] font-semibold ${active
                        ? "text-[var(--hs-text)]"
                        : "text-[var(--hs-text-muted)]"
                        }`}

                    >

                      {step}

                    </span>

                  </li>

                );

              })}

            </ol>

          </aside>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="min-w-0 p-3 sm:p-5 lg:p-6"
          >

            {setupStep === 1 && (

              <section>

                <StepHeader step="STEP 1 OF 3" title="Customer details" icon={UserRound}
                />

                <div className="grid min-w-0 grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 sm:gap-y-5 xl:grid-cols-4">

                  <InputField
                    label="Customer name"
                    placeholder="Rahul Kumar"
                    icon={UserRound}
                    value={customer.name}
                    required
                    error={customerErrors.name}
                    onChange={(value) =>
                      updateCustomer("name", value)
                    }

                  />

                  <InputField
                    label="Phone number"
                    placeholder="9876543210"
                    icon={UserRound}
                    value={customer.phone}
                    required
                    maxLength={10}
                    error={customerErrors.phone}
                    onChange={(value) =>

                      updateCustomer(

                        "phone",

                        value.replace(/\D/g, ""),

                      )

                    }

                  />

                  <InputField
                    label="Alternate phone"
                    placeholder="9876543211"
                    icon={UserRound}
                    value={customer.alternatePhone}
                    hint="Optional"
                    maxLength={10}
                    error={customerErrors.alternatePhone}
                    onChange={(value) =>

                      updateCustomer(

                        "alternatePhone",

                        value.replace(/\D/g, ""),

                      )

                    }

                  />

                  <InputField
                    label="Aadhaar number"
                    placeholder="12-digit Aadhaar"
                    icon={WalletCards}
                    value={customer.aadharNumber}
                    hint="Optional · 12 digits if provided"
                    maxLength={12}
                    error={customerErrors.aadharNumber}
                    onChange={(value) =>

                      updateCustomer(

                        "aadharNumber",

                        value.replace(/\D/g, ""),

                      )

                    }

                  />

                  <InputField
                    label="PAN number"
                    placeholder="ABCDE1234F"
                    icon={WalletCards}
                    value={customer.panNumber}
                    hint="Optional"
                    maxLength={10}
                    error={customerErrors.panNumber}
                    onChange={(value) =>

                      updateCustomer(

                        "panNumber",

                        value.toUpperCase(),

                      )

                    }

                  />

                  <InputField
                    label="Nominee name"
                    placeholder="Nominee full name"
                    icon={UserRound}
                    value={customer.nomineeName}
                    hint="Optional"
                    error={customerErrors.nomineeName}
                    onChange={(value) =>

                      updateCustomer(

                        "nomineeName",

                        value,

                      )

                    }

                  />

                  <InputField
                    label="Username"
                    placeholder="rahul01"
                    icon={UserRound}
                    value={customer.username}
                    required
                    error={customerErrors.username}
                    onChange={(value) =>

                      updateCustomer(

                        "username",

                        value,

                      )

                    }

                  />

                  <PasswordField
                    value={customer.password}
                    visible={showPassword}
                    error={customerErrors.password}
                    onToggle={() =>

                      setShowPassword(

                        (value) => !value,

                      )

                    }

                    onChange={(value) =>

                      updateCustomer(

                        "password",

                        value,

                      )

                    }

                  />

                </div>

              </section>

            )}

            {setupStep === 2 && (

              <section>

                <StepHeader
                  step="STEP 2 OF 3"
                  title="Account information"
                  icon={WalletCards}
                />

                <div className="space-y-4">

                  {accounts.map((account, index) => (

                    <div
                      key={index}
                      className="overflow-hidden rounded-lg border border-[var(--hs-border)] bg-white"
                    >

                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--hs-border-light)] bg-[var(--hs-surface)] px-3 py-3 sm:px-4">
                        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

                          <div className="grid size-9 place-items-center rounded-md bg-[var(--hs-primary-light)]">
                            <WalletCards className="size-4 text-[var(--hs-text)]" />
                          </div>

                          <div>

                            <p className="text-base font-bold text-[var(--hs-text)]">
                              Account {index + 1}
                            </p>

                            <p className="mt-0.5 text-sm text-[var(--hs-text-muted)]">
                              Collection account details
                            </p>

                          </div>

                        </div>

                        {accounts.length > 1 && (

                          <button

                            type="button"

                            onClick={() =>

                              removeAccount(index)

                            }

                            className="rounded-md p-2 text-[var(--hs-text-muted)] hover:bg-[var(--hs-danger-light)] hover:text-[var(--hs-danger)]"

                            aria-label={`Remove account ${index + 1

                              }`}

                          >

                            <Trash2 className="size-4" />

                          </button>

                        )}

                      </div>

                      <div className="grid min-w-0 grid-cols-1 gap-x-5 gap-y-4 p-3 sm:grid-cols-2 sm:gap-y-5 sm:p-4 xl:grid-cols-4">

                        <InputField
                          label="Account name"
                          placeholder="Monthly Savings"
                          icon={WalletCards}
                          value={account.accountName}
                          required
                          error={

                            accountErrors[index]

                              ?.accountName

                          }

                          onChange={(value) =>

                            updateAccount(

                              index,

                              "accountName",

                              value,

                            )

                          }

                        />

                        <InputField
                          label="Account number"
                          placeholder="ACC-1001"
                          icon={WalletCards}
                          value={account.accountNumber}
                          required
                          error={

                            accountErrors[index]

                              ?.accountNumber

                          }

                          onChange={(value) =>

                            updateAccount(

                              index,

                              "accountNumber",

                              value,

                            )

                          }

                        />

                        <SelectField
                          label="Scheme"
                          value={account.schemeType}
                          placeholder="Select scheme"
                          options={schemeOptions}
                          required
                          error={

                            accountErrors[index]

                              ?.schemeType

                          }

                          onChange={(value) =>

                            updateAccount(

                              index,

                              "schemeType",

                              value,

                            )

                          }

                        />

                        <InputField
                          label="Collection amount"
                          placeholder="₹1,000"
                          icon={WalletCards}
                          type="number"
                          value={account.collectionAmount}
                          required
                          error={

                            accountErrors[index]

                              ?.collectionAmount

                          }

                          onChange={(value) =>

                            updateAccount(

                              index,

                              "collectionAmount",

                              value,

                            )

                          }

                        />

                        <SelectField
                          label="Frequency"
                          value={account.frequency}
                          options={frequencyOptions}
                          required
                          onChange={(value) =>

                            updateAccount(

                              index,

                              "frequency",

                              value,

                            )

                          }

                        />

                        <InputField
                          label="Start date"
                          icon={CalendarDays}
                          type="date"
                          value={account.startDate}
                          required
                          error={

                            accountErrors[index]

                              ?.startDate

                          }

                          onChange={(value) =>

                            updateAccount(

                              index,

                              "startDate",

                              value,

                            )

                          }

                        />

                        <InputField
                          label="Maturity date"
                          icon={CalendarDays}
                          type="date"
                          value={account.maturityDate}
                          hint="Optional"
                          error={

                            accountErrors[index]

                              ?.maturityDate

                          }

                          onChange={(value) =>

                            updateAccount(

                              index,

                              "maturityDate",

                              value,

                            )

                          }

                        />

                        <InputField
                          label="Previous paid"
                          placeholder="0"
                          icon={WalletCards}
                          type="number"
                          value={account.previousCollection}
                          hint="Optional"
                          onChange={(value) =>

                            updateAccount(

                              index,

                              "previousCollection",

                              value,

                            )

                          }

                        />

                      </div>

                    </div>

                  ))}

                  <button
                    type="button"
                    onClick={addAccount}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--hs-border)] bg-[var(--hs-surface)] text-sm font-bold text-[var(--hs-text)] transition hover:border-[var(--hs-text-muted)] hover:bg-[var(--hs-hover)]">

                    <Plus className="size-4" />
                    Add another account
                  </button>
                </div>

              </section>

            )}

            {setupStep === 3 && (

              <section>

                <StepHeader

                  step="STEP 3 OF 3"

                  title="Review account & customer"

                  icon={CheckCircle2}

                />

                <div className="overflow-hidden rounded-lg border border-[var(--hs-border)]">

                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--hs-primary-light)] px-3 py-3 sm:px-4">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wide text-[var(--hs-text-muted)]">

                        Customer profile

                      </p>

                      <p className="mt-0.5 text-base font-bold text-[var(--hs-text)]">

                        {customer.name ||

                          "Customer name"}

                      </p>

                    </div>

                    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--hs-primary)] text-sm font-bold text-white">

                      {getInitials(customer.name)}

                    </div>

                  </div>

                  <div className="grid grid-cols-1 gap-4 p-3 min-[420px]:grid-cols-2 sm:gap-5 sm:p-4 lg:grid-cols-4">

                    <ReviewItem
                      label="Customer name"
                      value={String(savedCustomerDetails?.customer.full_name ?? createdCustomerId ?? "—")}
                    />
                    <ReviewItem
                      label="Phone"
                      value={customer.phone}
                    />

                    <ReviewItem

                      label="Alternate phone"

                      value={

                        customer.alternatePhone

                      }

                    />

                    <ReviewItem

                      label="Aadhaar"

                      value={maskAadhaar(String(savedCustomerDetails?.customer.aadhaar_number ?? customer.aadharNumber))}

                    />

                    <ReviewItem

                      label="PAN"

                      value={customer.panNumber}

                    />

                    <ReviewItem

                      label="Nominee"

                      value={customer.nomineeName}

                    />

                    <ReviewItem

                      label="Username"

                      value={customer.username}

                    />

                    <ReviewItem

                      label="Password"

                      value={customer.password}

                    />

                  </div>

                </div>

                <div className="mt-4 overflow-hidden rounded-lg border border-[var(--hs-border)]">

                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--hs-primary-light)] px-3 py-3 sm:px-4">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wide text-[var(--hs-text-muted)]">

                        Collection accounts

                      </p>

                      <p className="mt-0.5 text-base font-bold text-[var(--hs-text)]">

                        Account summary

                      </p>

                    </div>

                    <Badge className="bg-[var(--hs-primary)] px-3 py-1 text-xs font-bold text-white hover:bg-[var(--hs-primary)]">

                      {(savedCustomerDetails?.accounts ?? []).length}{" "}

                      {(savedCustomerDetails?.accounts ?? []).length === 1
                        ? "Account"
                        : "Accounts"}

                    </Badge>

                  </div>

                  <div className="divide-y divide-[var(--hs-border-light)]">

                    {(savedCustomerDetails?.accounts ?? []).map((account) => (
                      <div key={account.id} className="p-4 sm:p-5">
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-bold text-[var(--hs-text)]">{account.account_name}</p>
                            <p className="mt-0.5 text-sm text-[var(--hs-text-muted)]">{account.account_number}</p>
                          </div>
                          <Badge variant="outline" className="border-[var(--hs-border)] px-3 py-1 text-xs font-semibold text-[var(--hs-text)]">
                            {account.scheme}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-4 rounded-lg bg-[var(--hs-background)] p-3 min-[420px]:grid-cols-2 sm:grid-cols-3 sm:gap-y-5 sm:p-4 lg:grid-cols-4">
                          <ReviewItem label="Collection" value={`₹${Number(account.collection_amount).toLocaleString("en-IN")}`} />
                          <ReviewItem label="Frequency" value={account.frequency} />
                          <ReviewItem label="Start date" value={account.start_date} />
                          <ReviewItem label="Maturity date" value={account.maturity_date || "-"} />
                          <ReviewItem label="Previous paid" value={`₹${Number(account.previous_paid || 0).toLocaleString("en-IN")}`} />
                          <ReviewItem label="Status" value={account.status || "-"} />
                        </div>
                      </div>
                    ))}

                  </div>

                </div>

              </section>

            )}

            <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[var(--hs-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">

              {setupStep > 1 ? (

                <Button

                  type="button"

                  variant="ghost"

                  onClick={goBack}

                  className="h-10 justify-center text-sm text-[var(--hs-text-secondary)] hover:text-[var(--hs-text)] sm:justify-start"

                >

                  <ArrowLeft className="size-4" />

                  Back

                </Button>

              ) : (

                <p className="hidden text-sm text-[var(--hs-text-muted)] sm:block">

                  Step 1 of 3 · Customer identity

                </p>

              )}

              <div className="flex w-full min-w-0 flex-col gap-2 min-[420px]:flex-row sm:w-auto">

                {setupStep === 2 && (

                  <Button

                    type="button"

                    variant="outline"

                    onClick={addAccount}

                    className="h-10 w-full text-sm min-[420px]:flex-1 sm:w-auto sm:flex-none"

                  >

                    <Plus className="size-4" />

                    Add account

                  </Button>

                )}

                {setupStep < 3 ? (

                  <Button

                    type="button"

                    onClick={goNext}

                    className="h-10 w-full rounded-[8px] bg-[var(--hs-primary)] text-sm font-bold text-white shadow-none hover:bg-[var(--hs-primary-light)] hover:text-black min-[420px]:flex-1 sm:w-auto sm:flex-none sm:px-6"
                  >

                    Continue

                    <span>→</span>

                  </Button>

                ) : (

                  <Button

                    type="submit"

                    disabled={isSubmitting}

                    className="h-10 w-full rounded-lg bg-[var(--hs-primary)] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--hs-primary-dark)] focus-visible:ring-2 focus-visible:ring-[var(--hs-primary)] focus-visible:ring-offset-2 active:scale-100 min-[420px]:flex-1 sm:w-auto sm:flex-none sm:px-6"

                  >

                    {isSubmitting
                      ? "Finishing..."
                      : "Done · Add another customer"}

                  </Button>

                )}

              </div>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

}

function StepHeader({

  step,

  title,

  icon: Icon,

}: {

  step: string;

  title: string;

  icon: typeof UserRound;

}) {

  return (

    <div className="mb-5 flex min-w-0 items-start justify-between gap-3 sm:gap-4">

      <div>

        <p className="text-xs font-bold tracking-wide text-[var(--hs-primary)]">

          {step}

        </p>

        <h3 className="mt-0.5 text-xl font-bold tracking-tight text-[var(--hs-text)] sm:text-[26px]">

          {title}

        </h3>

      </div>

      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--hs-primary-light)] sm:size-11">

        <Icon className="size-5 text-[var(--hs-text)]" />

      </div>

    </div>

  );

}

function InputField({

  label,

  placeholder,

  icon: Icon,

  type = "text",

  value,

  onChange,

  maxLength,

  required,

  hint,

  error,

}: {

  label: string;

  placeholder?: string;

  icon: typeof UserRound;

  type?: string;

  value: string;

  onChange: (value: string) => void;

  maxLength?: number;

  required?: boolean;

  hint?: string;

  error?: string;

}) {

  return (

    <label className="block min-w-0">

      <span className="mb-1.5 block text-sm font-bold text-[var(--hs-text-secondary)]">

        {label}

        {required ? (
          <span className="ml-1 text-[var(--hs-danger)]">*</span>
        ) : (
          <span className="ml-2 text-[10px] font-medium normal-case tracking-normal text-[var(--hs-text-muted)]">
            Optional
          </span>
        )}

      </span>

      <span

        className={`flex h-[44px] items-center gap-2.5 rounded-lg border bg-white px-3 transition ${error

          ? "border-[var(--hs-primary-border)] ring-1 ring-[var(--hs-primary-light)]"

          : "border-[var(--hs-border)]"

          } focus-within:border-[var(--hs-text)] focus-within:ring-2 focus-within:ring-[var(--hs-primary)]/20`}

      >

        <Icon className="size-4 shrink-0 text-[var(--hs-text-muted)]" />

        <input

          type={type}

          value={value}

          maxLength={maxLength}

          placeholder={placeholder}

          onChange={(

            event: { target: { value: string } },

          ) => onChange(event.target.value)}

          className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[var(--hs-text)] outline-none placeholder:text-sm placeholder:font-normal placeholder:text-[var(--hs-text-muted)]"

        />

      </span>

      {error ? (

        <span className="mt-1.5 flex items-start gap-1 text-[11px] font-medium leading-4 text-[var(--hs-danger)]">

          <AlertCircle className="mt-0.5 size-3 shrink-0" />

          <span>{error}</span>

        </span>

      ) : hint ? (

        <span className="mt-1 block text-[11px] text-[var(--hs-text-muted)]">

          {hint}

        </span>

      ) : null}

    </label>

  );

}

function PasswordField({

  value,

  visible,

  onToggle,

  onChange,

  error,

}: {

  value: string;

  visible: boolean;

  onToggle: () => void;

  onChange: (value: string) => void;

  error?: string;

}) {

  return (

    <label className="block min-w-0">

      <span className="mb-1.5 block text-sm font-bold text-[var(--hs-text-secondary)]">

        Password

        <span className="ml-0.5 text-[var(--hs-danger)]">

          *

        </span>

      </span>

      <span

        className={`flex h-[44px] items-center gap-2.5 rounded-lg border bg-white px-3 transition ${error

          ? "border-[var(--hs-primary-border)] ring-1 ring-[var(--hs-primary-light)]"

          : "border-[var(--hs-border)]"

          } focus-within:border-[var(--hs-text)] focus-within:ring-2 focus-within:ring-[var(--hs-primary)]/20`}

      >

        <LockKeyhole className="size-4 shrink-0 text-[var(--hs-text-muted)]" />

        <input

          type={

            visible ? "text" : "password"

          }

          value={value}

          placeholder="Minimum 6 characters"

          onChange={(

            event: { target: { value: string } },

          ) => onChange(event.target.value)}

          className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[var(--hs-text)] outline-none placeholder:text-sm placeholder:font-normal placeholder:text-[var(--hs-text-muted)]"

        />

        <button

          type="button"

          onClick={onToggle}

          className="text-[var(--hs-text-muted)] transition hover:text-[var(--hs-text)]"

          aria-label={

            visible

              ? "Hide password"

              : "Show password"

          }

        >

          {visible ? (

            <EyeOff className="size-4" />

          ) : (

            <Eye className="size-4" />

          )}

        </button>

      </span>

      {error && (

        <span className="mt-1.5 flex items-start gap-1 text-[11px] font-medium leading-4 text-[var(--hs-danger)]">

          <AlertCircle className="mt-0.5 size-3 shrink-0" />

          <span>{error}</span>

        </span>

      )}

    </label>

  );

}

function SelectField({

  label,

  value,

  placeholder,

  options,

  onChange,

  required,

  error,

}: {

  label: string;

  value: string;

  placeholder?: string;

  options: string[];

  onChange: (value: string) => void;

  required?: boolean;

  error?: string;

}) {

  return (

    <label className="block min-w-0">

      <span className="mb-1.5 block text-sm font-bold text-[var(--hs-text-secondary)]">

        {label}

        {required ? (
          <span className="ml-1 text-[var(--hs-danger)]">*</span>
        ) : (
          <span className="ml-2 text-[10px] font-medium normal-case tracking-normal text-[var(--hs-text-muted)]">
            Optional
          </span>
        )}

      </span>

      <span className="relative block">

        <select

          value={value}

          onChange={(

            event: { target: { value: string } },

          ) => onChange(event.target.value)}

          className={`h-[44px] w-full appearance-none rounded-lg border bg-white px-3 pr-9 text-[15px] font-medium text-[var(--hs-text)] outline-none transition ${error

            ? "border-[var(--hs-primary-border)] ring-1 ring-[var(--hs-primary-light)]"

            : "border-[var(--hs-border)]"

            } focus:border-[var(--hs-text)] focus:ring-2 focus:ring-[var(--hs-primary)]/20`}

        >

          {placeholder && (

            <option value="">

              {placeholder}

            </option>

          )}

          {options.map((option) => (

            <option

              key={option}

              value={option}

            >

              {option}

            </option>

          ))}

        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--hs-text-muted)]" />

      </span>

      {error && (

        <span className="mt-1.5 flex items-start gap-1 text-[11px] font-medium leading-4 text-[var(--hs-danger)]">

          <AlertCircle className="mt-0.5 size-3 shrink-0" />

          <span>{error}</span>

        </span>

      )}

    </label>

  );

}

function ReviewItem({

  label,

  value,

}: {

  label: string;

  value: string;

}) {

  return (

    <div className="min-w-0">

      <p className="text-xs font-bold uppercase tracking-wide text-[var(--hs-text-muted)]">

        {label}

      </p>

      <p className="mt-1 break-words text-sm font-bold text-[var(--hs-text)] sm:text-[15px]">

        {value || "-"}

      </p>

    </div>

  );

}

function getInitials(name: string) {

  if (!name.trim()) return "CU";

  return name

    .trim()

    .split(/\s+/)

    .slice(0, 2)

    .map((part) =>

      part.charAt(0).toUpperCase(),

    )

    .join("");

}

function maskAadhaar(value: string) {

  if (value.length !== 12) {

    return value || "-";

  }

  return `XXXX XXXX ${value.slice(-4)}`;

}

export default PipelineSection;
