"use client";

import { FormEvent, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  Plus,
  Trash2,
  UserRound,
  WalletCards,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const frequencyOptions = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Half-Yearly",
  "Yearly",
  "One-Time",
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

export function PipelineSection() {
  const [customer, setCustomer] = useState<Customer>(
    emptyCustomer(),
  );

  const [accounts, setAccounts] = useState<Account[]>([
    emptyAccount(),
  ]);

  const [customerErrors, setCustomerErrors] =
    useState<CustomerErrors>({});

  const [accountErrors, setAccountErrors] =
    useState<AccountErrors[]>([{}]);

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
      nextErrors.phone =
        "Phone number must contain exactly 10 digits.";
    }

    if (!/^\d{10}$/.test(customer.alternatePhone)) {
      nextErrors.alternatePhone =
        "Alternate phone must contain exactly 10 digits.";
    }

    if (!/^\d{12}$/.test(customer.aadharNumber)) {
      nextErrors.aadharNumber =
        "Aadhaar number must contain exactly 12 digits.";
    }

    if (
      !/^[A-Z]{5}\d{4}[A-Z]$/.test(
        customer.panNumber.toUpperCase(),
      )
    ) {
      nextErrors.panNumber =
        "Enter a valid PAN, e.g. ABCDE1234F.";
    }

    if (!customer.nomineeName.trim()) {
      nextErrors.nomineeName =
        "Nominee name is required.";
    }

    if (!customer.username.trim()) {
      nextErrors.username = "Username is required.";
    }

    if (customer.password.length < 6) {
      nextErrors.password =
        "Password must be at least 6 characters.";
    }

    return nextErrors;
  };


  const validateAccounts = (): AccountErrors[] => {
    const nextErrors: AccountErrors[] = accounts.map(
      () => ({}),
    );

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

      if (!account.maturityDate) {
        nextErrors[index].maturityDate =
          "Maturity date is required.";
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

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const goNext = () => {
    setSuccess("");

    if (setupStep === 1) {
      const nextErrors = validateCustomer();
      setCustomerErrors(nextErrors);

      if (hasCustomerErrors(nextErrors)) {
        return;
      }
    }

    if (setupStep === 2) {
      const nextErrors = validateAccounts();
      setAccountErrors(nextErrors);

      if (hasAccountErrors(nextErrors)) {
        return;
      }
    }

    if (setupStep < 3) {
      setSetupStep((current) => current + 1);
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

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSuccess("");

    const nextCustomerErrors =
      validateCustomer();

    const nextAccountErrors =
      validateAccounts();

    setCustomerErrors(nextCustomerErrors);
    setAccountErrors(nextAccountErrors);

    if (
      hasCustomerErrors(nextCustomerErrors) ||
      hasAccountErrors(nextAccountErrors)
    ) {

      if (hasCustomerErrors(nextCustomerErrors)) {
        setSetupStep(1);
      } else if (hasAccountErrors(nextAccountErrors)) {
        setSetupStep(2);
      }

      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 500),
    );

    setIsSubmitting(false);

    setCustomerErrors({});
    setAccountErrors(accounts.map(() => ({})));

    setSuccess(
      `Customer ${customer.name} created successfully with ${accounts.length
      } account${accounts.length === 1 ? "" : "s"}.`,
    );
  };

  return (
    <div className="mx-auto w-full">

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#466257]">Overview /  Add Customer</p>
            <h2 className="text-3xl font-bold tracking-tight text-[#173b30] sm:text-4xl">
              Customer{" "}
              <span className="bg-[#c4f36b] px-2">creation.</span>
            </h2>
            <p className="mt-2 text-sm text-[#6b8176]"> Create a customer profile and add collection
              accounts.</p>
          </div>
        </div>

        {/* STEP TABS */}

        <div className="flex w-full overflow-hidden rounded-lg border border-[#d8e2db] bg-white p-1 shadow-sm lg:w-auto">
          {[
            "Guided setup",
            "Account info",
            "Review",
          ].map((item, index) => {
            const active = setupStep === index + 1;
            const completed =
              setupStep > index + 1;

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
                className={`
                  flex-1 whitespace-nowrap rounded-md
                  px-3 py-2 text-xs font-bold
                  transition sm:px-4
                  ${active
                    ? "bg-[#0b4a35] text-white"
                    : completed
                      ? "text-[#173b30] hover:bg-[#eef5f0]"
                      : "text-[#91a098]"
                  }
                `}
              >
                <span className="mr-1 opacity-50">
                  0{index + 1}
                </span>

                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#71837a]">
          Customer onboarding
        </p>

        <div className="hidden items-center gap-1.5 text-xs font-semibold text-[#16815c] sm:flex">
          <Check className="size-3.5" />
          Dashboard style matched
        </div>
      </div>

      {success && (
        <Alert className="mb-4 border-emerald-200 bg-emerald-50 py-3 text-emerald-900">
          <CheckCircle2 className="size-4" />

          <AlertTitle className="text-sm">
            Customer created
          </AlertTitle>

          <AlertDescription className="text-sm">
            {success}
          </AlertDescription>
        </Alert>
      )}


      <div className="grid overflow-hidden rounded-xl border border-[#d8e2db] bg-white shadow-[0_2px_10px_rgba(23,59,48,0.04)] lg:grid-cols-[190px_1fr]">

        <aside className="hidden bg-[#eef7f1] p-5 lg:block">
          <p className="text-xs font-bold uppercase tracking-wide text-[#6b8176]">
            New customer
          </p>

          <h2 className="mt-1.5 text-xl font-bold text-[#173b30]">
            Account setup
          </h2>

          <ol className="mt-7 space-y-5">
            {[
              "Customer details",
              "Account info",
              "Review account",
            ].map((step, index) => {
              const active =
                setupStep === index + 1;

              const completed =
                setupStep > index + 1;

              return (
                <li
                  key={step}
                  className="flex items-center gap-3"
                >
                  <span
                    className={`
                      grid size-6 shrink-0 place-items-center
                      rounded-full text-sm font-bold
                      ${active
                        ? "bg-[#b9ec4f] text-[#173b30]"
                        : completed
                          ? "bg-[#0b4a35] text-white"
                          : "border border-[#d8e2db] bg-white text-[#7b8c84]"
                      }
                    `}
                  >
                    {completed ? (
                      <Check className="size-4" />
                    ) : (
                      index + 1
                    )}
                  </span>

                  <span
                    className={`text-[13px] font-semibold ${active
                      ? "text-[#173b30]"
                      : "text-[#71837a]"
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
          className="min-w-0 p-4 sm:p-5 lg:p-6"
        >

          {setupStep === 1 && (
            <section>
              <StepHeader
                step="STEP 1 OF 3"
                title="Customer details"

                icon={UserRound}
              />

              <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
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
                  required
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
                  required
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
                  required
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
                  required
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

          {/* =================================================
              STEP 2
          ================================================= */}

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
                    className="overflow-hidden rounded-lg border border-[#d8e2db] bg-white"
                  >
                    {/* ACCOUNT HEADER */}

                    <div className="flex items-center justify-between border-b border-[#edf2ee] bg-[#fbfdfb] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 place-items-center rounded-md bg-[#eaf4ee]">
                          <WalletCards className="size-4 text-[#173b30]" />
                        </div>

                        <div>
                          <p className="text-base font-bold text-[#173b30]">
                            Account {index + 1}
                          </p>

                          <p className="mt-0.5 text-sm text-[#71837a]">
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
                          className="rounded-md p-2 text-[#84948c] hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remove account ${index + 1
                            }`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>

                    {/* ACCOUNT FIELDS */}

                    <div className="grid gap-x-5 gap-y-5 p-4 sm:grid-cols-2 xl:grid-cols-4">
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
                        required
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

                {/* ADD ACCOUNT */}

                <button
                  type="button"
                  onClick={addAccount}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#bfd0c6] bg-[#fbfdfb] text-sm font-bold text-[#173b30] transition hover:border-[#8eaa9d] hover:bg-[#f2f8f4]"
                >
                  <Plus className="size-4" />
                  Add another account
                </button>
              </div>
            </section>
          )}

          {/* =================================================
              STEP 3
          ================================================= */}

          {setupStep === 3 && (
            <section>
              <StepHeader
                step="STEP 3 OF 3"
                title="Review customer"
                icon={CheckCircle2}
              />

              {/* CUSTOMER */}

              <div className="overflow-hidden rounded-lg border border-[#d8e2db]">
                <div className="flex items-center justify-between bg-[#f5faf7] px-4 py-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#71837a]">
                      Customer profile
                    </p>

                    <p className="mt-0.5 text-base font-bold text-[#173b30]">
                      {customer.name ||
                        "Customer name"}
                    </p>
                  </div>

                  <div className="grid size-10 place-items-center rounded-full bg-[#b9ec4f] text-sm font-bold text-[#173b30]">
                    {getInitials(customer.name)}
                  </div>
                </div>

                <div className="grid gap-5 p-4 sm:grid-cols-2 lg:grid-cols-4">
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
                    value={maskAadhaar(
                      customer.aadharNumber,
                    )}
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
                </div>
              </div>

              {/* ACCOUNTS */}

              <div className="mt-4 overflow-hidden rounded-lg border border-[#d8e2db]">
                <div className="flex items-center justify-between bg-[#f5faf7] px-4 py-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#71837a]">
                      Collection accounts
                    </p>

                    <p className="mt-0.5 text-base font-bold text-[#173b30]">
                      Account summary
                    </p>
                  </div>

                  <Badge className="bg-[#b9ec4f] px-3 py-1 text-xs font-bold text-[#173b30] hover:bg-[#b9ec4f]">
                    {accounts.length}{" "}
                    {accounts.length === 1
                      ? "Account"
                      : "Accounts"}
                  </Badge>
                </div>

                <div className="divide-y divide-[#edf2ee]">
                  {accounts.map(
                    (account, index) => (
                      <div
                        key={index}
                        className="p-4"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <p className="text-base font-bold text-[#173b30]">
                              {account.accountName ||
                                `Account ${index + 1
                                }`}
                            </p>

                            <p className="mt-0.5 text-sm text-[#71837a]">
                              {account.accountNumber ||
                                "Account number"}
                            </p>
                          </div>

                          <Badge
                            variant="outline"
                            className="border-[#d8e2db] px-3 py-1 text-xs font-semibold text-[#173b30]"
                          >
                            {account.schemeType ||
                              "Scheme"}
                          </Badge>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                          <ReviewItem
                            label="Collection"
                            value={
                              account.collectionAmount
                                ? `₹${Number(
                                  account.collectionAmount,
                                ).toLocaleString(
                                  "en-IN",
                                )}`
                                : "-"
                            }
                          />

                          <ReviewItem
                            label="Frequency"
                            value={
                              account.frequency ||
                              "-"
                            }
                          />

                          <ReviewItem
                            label="Start date"
                            value={
                              account.startDate ||
                              "-"
                            }
                          />

                          <ReviewItem
                            label="Maturity date"
                            value={
                              account.maturityDate ||
                              "-"
                            }
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>
          )}

          {/* =================================================
              ACTION BAR
          ================================================= */}

          <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[#e0e8e3] pt-4 sm:flex-row sm:items-center sm:justify-between">
            {setupStep > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={goBack}
                className="h-10 justify-center text-sm text-[#6b8176] hover:text-[#173b30] sm:justify-start"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
            ) : (
              <p className="hidden text-sm text-[#71837a] sm:block">
                Step 1 of 3 · Customer identity
              </p>
            )}

            <div className="flex w-full gap-2 sm:w-auto">
              {setupStep === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAccount}
                  className="h-10 flex-1 text-sm sm:flex-none"
                >
                  <Plus className="size-4" />
                  Add account
                </Button>
              )}

              {setupStep < 3 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="h-10 flex-1 bg-[#b9ec4f] text-sm font-bold text-[#173b30] shadow-none hover:bg-[#c4f36b] sm:flex-none sm:px-6"
                >
                  Continue
                  <span>→</span>
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 flex-1 bg-[#07382f] text-sm font-bold text-white shadow-none hover:bg-[#123c30] sm:flex-none sm:px-6"
                >
                  {isSubmitting
                    ? "Creating..."
                    : "Create Customer"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   STEP HEADER
========================================================= */

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
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold tracking-wide text-[#638d17]">
          {step}
        </p>

        <h3 className="mt-0.5 text-2xl font-bold tracking-tight text-[#173b30] sm:text-[26px]">
          {title}
        </h3>
      </div>

      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#edf6f0] sm:size-11">
        <Icon className="size-5 text-[#173b30]" />
      </div>
    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

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
      <span className="mb-1.5 block text-sm font-bold text-[#526b60]">
        {label}

        {required && (
          <span className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </span>

      <span
        className={`flex h-[44px] items-center gap-2.5 rounded-lg border bg-white px-3 transition ${error
          ? "border-red-300 ring-1 ring-red-100"
          : "border-[#d8e2db]"
          } focus-within:border-[#173b30] focus-within:ring-2 focus-within:ring-[#b9ec4f]/20`}
      >
        <Icon className="size-4 shrink-0 text-[#7c9086]" />

        <input
          type={type}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(
            event: { target: { value: string } },
          ) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#173b30] outline-none placeholder:text-sm placeholder:font-normal placeholder:text-[#9aa9a2]"
        />
      </span>

      {error ? (
        <span className="mt-1.5 flex items-start gap-1 text-[11px] font-medium leading-4 text-red-600">
          <AlertCircle className="mt-0.5 size-3 shrink-0" />
          <span>{error}</span>
        </span>
      ) : hint ? (
        <span className="mt-1 block text-[11px] text-[#87968f]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

/* =========================================================
   PASSWORD FIELD
========================================================= */

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
      <span className="mb-1.5 block text-sm font-bold text-[#526b60]">
        Password

        <span className="ml-0.5 text-red-500">
          *
        </span>
      </span>

      <span
        className={`flex h-[44px] items-center gap-2.5 rounded-lg border bg-white px-3 transition ${error
          ? "border-red-300 ring-1 ring-red-100"
          : "border-[#d8e2db]"
          } focus-within:border-[#173b30] focus-within:ring-2 focus-within:ring-[#b9ec4f]/20`}
      >
        <LockKeyhole className="size-4 shrink-0 text-[#7c9086]" />

        <input
          type={
            visible ? "text" : "password"
          }
          value={value}
          placeholder="Minimum 6 characters"
          onChange={(
            event: { target: { value: string } },
          ) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#173b30] outline-none placeholder:text-sm placeholder:font-normal placeholder:text-[#9aa9a2]"
        />

        <button
          type="button"
          onClick={onToggle}
          className="text-[#7c9086] transition hover:text-[#173b30]"
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
        <span className="mt-1.5 flex items-start gap-1 text-[11px] font-medium leading-4 text-red-600">
          <AlertCircle className="mt-0.5 size-3 shrink-0" />
          <span>{error}</span>
        </span>
      )}
    </label>
  );
}

/* =========================================================
   SELECT FIELD
========================================================= */

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
      <span className="mb-1.5 block text-sm font-bold text-[#526b60]">
        {label}

        {required && (
          <span className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </span>

      <span className="relative block">
        <select
          value={value}
          onChange={(
            event: { target: { value: string } },
          ) => onChange(event.target.value)}
          className={`h-[44px] w-full appearance-none rounded-lg border bg-white px-3 pr-9 text-[15px] font-medium text-[#173b30] outline-none transition ${error
            ? "border-red-300 ring-1 ring-red-100"
            : "border-[#d8e2db]"
            } focus:border-[#173b30] focus:ring-2 focus:ring-[#b9ec4f]/20`}
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

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#71837a]" />
      </span>

      {error && (
        <span className="mt-1.5 flex items-start gap-1 text-[11px] font-medium leading-4 text-red-600">
          <AlertCircle className="mt-0.5 size-3 shrink-0" />
          <span>{error}</span>
        </span>
      )}
    </label>
  );
}

/* =========================================================
   REVIEW ITEM
========================================================= */

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-wide text-[#87968f]">
        {label}
      </p>

      <p className="mt-1 truncate text-[15px] font-bold text-[#173b30]">
        {value || "-"}
      </p>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

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
