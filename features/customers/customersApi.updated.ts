
import { baseApi } from "@/lib/baseApi";

export interface CreateCustomerRequest {
  full_name: string;
  phone: string;
  alternate_phone: string;
  aadhaar_number: string;
  pan_number: string;
  nominee_name: string;
  username: string;
  password: string;
}

export interface CustomerRecord {
  id: string;
  user_id?: string | null;
  customer_code?: string;
  full_name: string;
  phone: string;
  alternate_phone?: string | null;
  aadhaar_number?: string | null;
  pan_number?: string | null;
  nominee_name?: string | null;
  status?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CustomerListResponse {
  success: boolean;
  message?: string;
  customers: CustomerRecord[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCustomerResponse {
  success: boolean;
  message?: string;
  customer?: CustomerRecord;
}


export interface CreateAccountRequest {
  account_number: string;
  scheme: string;
  account_name: string;
  collection_amount: number;
  frequency: string;
  start_date: string;
  maturity_date: string | null;
  previous_paid: number;
}

export interface AccountRecord {
  id: string;
  customer_id: string;
  account_number: string;
  scheme: string;
  account_name: string;
  collection_amount: number | string;
  frequency: string;
  start_date: string;
  maturity_date: string | null;
  previous_paid: number | string;
  status: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateAccountResponse {
  success: boolean;
  message?: string;
  account?: AccountRecord;
}

export interface CustomerDetailsResponse {
  success: boolean;
  message?: string;
  customer: CustomerRecord;
  accounts: AccountRecord[];
}

export type CollectionStatus =
  | "paid"
  | "due"
  | "overdue"
  | "not-due"
  | "matured";

export type Frequency = "Daily" | "Weekly" | "Monthly";

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
  payments: Record<string, number>;
  accountStatus: string;
  previousPaid: number;
}

export interface AddAdminCollectionRequest {
  customerId: string;
  accountId: string;
  amount: number;
  payment_date: string;
  reference_number?: string;
  notes?: string;
  idempotencyKey: string;
}

export interface AddAdminCollectionResponse {
  success: boolean;
  message?: string;
  duplicate?: boolean;
  payment?: {
    id: string;
    customer_id?: string;
    account_id?: string;
    amount: number | string;
    payment_date: string;
    status: string;
    receipt_number?: string;
    reference_number?: string | null;
    notes?: string | null;
    [key: string]: unknown;
  };
}

function normalizeFrequency(value?: string): Frequency {
  const frequencyMap: Record<string, Frequency> = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
  };

  return (
    frequencyMap[(value ?? "").trim().toUpperCase()] ?? "Monthly"
  );
}

function normalizeAccount(
  customer: CustomerRecord,
  account: AccountRecord
): CollectionAccount {
  return {
    id: account.id,
    customerId: customer.id,
    customer: customer.full_name || "Unknown customer",
    phone: customer.phone || "",
    account: account.account_number || "—",
    scheme: account.account_name || account.scheme || "—",
    amount: Number(account.collection_amount) || 0,
    frequency: normalizeFrequency(account.frequency),
    status: "due",
    startDate: account.start_date || "",
    maturityDate: account.maturity_date || "",
    maturityAmount: 0,
    nextDue: "",
    payments: {},
    accountStatus: account.status || "UNKNOWN",
    previousPaid: Number(account.previous_paid) || 0,
  };
}


export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createCustomer: builder.mutation<
      CreateCustomerResponse,
      CreateCustomerRequest
    >({
      query: (body) => ({
        url: "/customers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customer", "Collection"],
    }),

    createAccount: builder.mutation<
      CreateAccountResponse,
      { customerId: string; body: CreateAccountRequest }
    >({
      query: ({ customerId, body }) => ({
        url: `/customers/${encodeURIComponent(customerId)}/accounts`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: "Customer", id: customerId },
        "Customer",
        "Collection",
      ],
    }),

    listCustomers: builder.query<
      CustomerListResponse,
      {
        search?: string;
        status?: string;
        page?: number;
        limit?: number;
      } | void
    >({
      query: (params) => ({
        url: "/customers",
        params: params || undefined,
        method: "GET",
      }),
      providesTags: (result) => [
        "Customer",
        ...(result?.customers ?? []).map((customer) => ({
          type: "Customer" as const,
          id: customer.id,
        })),
      ],
    }),


    getCustomerDetails: builder.query<
      CustomerDetailsResponse,
      string
    >({
      query: (customerId) =>
        `/customers/${encodeURIComponent(customerId)}`,
      providesTags: (_result, _error, customerId) => [
        { type: "Customer", id: customerId },
      ],
    }),

    addAdminCollection: builder.mutation<
      AddAdminCollectionResponse,
      AddAdminCollectionRequest
    >({
      query: ({
        customerId,
        accountId,
        amount,
        payment_date,
        reference_number,
        notes,
        idempotencyKey,
      }) => ({
        url:
          `/customers/${encodeURIComponent(customerId)}` +
          `/accounts/${encodeURIComponent(accountId)}/payments`,
        method: "POST",
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
        body: {
          amount,
          payment_date,
          reference_number,
          notes,
        },
      }),
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: "Customer", id: customerId },
        "Customer",
        "Collection",
      ],
    }),

    getCollectionAccounts: builder.query<
      CollectionAccount[],
      { page?: number; limit?: number } | void
    >({
      async queryFn(arg, _api, _extraOptions, baseQuery) {
        try {
          const page = arg?.page ?? 1;
          const limit = arg?.limit ?? 100;

          // 1. Load the paginated customer list.
          const customersResult = await baseQuery({
            url: "/customers",
            params: { page, limit },
            method: "GET",
          });

          if (customersResult.error) {
            return { error: customersResult.error };
          }

          const customerList =
            customersResult.data as CustomerListResponse;

          if (
            !customerList?.success ||
            !Array.isArray(customerList.customers)
          ) {
            return {
              error: {
                status: "CUSTOM_ERROR" as const,
                error:
                  customerList?.message ??
                  "Invalid customer-list response.",
              },
            };
          }

          // 2. Load details and account lists for all customers.
          const customerResults = await Promise.all(
            customerList.customers.map(async (listedCustomer) => {
              const result = await baseQuery({
                url: `/customers/${encodeURIComponent(listedCustomer.id)}`,
                method: "GET",
              });

              if (result.error) {
                return {
                  ok: false as const,
                  error: result.error,
                  customerName: listedCustomer.full_name,
                };
              }

              const details =
                result.data as CustomerDetailsResponse;

              if (
                !details?.success ||
                !details.customer ||
                !Array.isArray(details.accounts)
              ) {
                return {
                  ok: false as const,
                  error: {
                    status: "CUSTOM_ERROR" as const,
                    error:
                      details?.message ??
                      "Invalid customer-details response.",
                  },
                  customerName: listedCustomer.full_name,
                };
              }

              return {
                ok: true as const,
                customer: details.customer,
                accounts: details.accounts,
              };
            }),
          );

          const failedCustomer = customerResults.find(
            (result) => !result.ok,
          );

          if (failedCustomer && !failedCustomer.ok) {
            return {
              error: {
                status: "CUSTOM_ERROR" as const,
                error:
                  `Could not load account details for ` +
                  `${failedCustomer.customerName}.`,
              },
            };
          }

          const accountEntries = customerResults.flatMap((result) => {
            if (!result.ok) {
              return [];
            }

            return result.accounts.map((account) => ({
              customer: result.customer,
              account,
            }));
          });

          // 3. Fetch payment history for every account.
          const accountResults = await Promise.all(
            accountEntries.map(async ({ customer, account }) => {
              const normalizedAccount = normalizeAccount(customer, account);

              const paymentResult = await baseQuery({
                url:
                  `/customers/${encodeURIComponent(customer.id)}` +
                  `/accounts/${encodeURIComponent(account.id)}/payments`,
                method: "GET",
              });

              if (paymentResult.error) {
                return {
                  ok: false as const,
                  error: paymentResult.error,
                  customerName: customer.full_name,
                  accountNumber: account.account_number,
                };
              }

              const paymentResponse = paymentResult.data as {
                success?: boolean;
                count?: number;
                payments?: Array<{
                  id: string;
                  amount: number | string;
                  payment_date: string;
                  status: string;
                }>;
              };

              if (
                paymentResponse?.success !== true ||
                !Array.isArray(paymentResponse.payments)
              ) {
                return {
                  ok: false as const,
                  error: {
                    status: "CUSTOM_ERROR" as const,
                    error: "Invalid payment-history response.",
                  },
                  customerName: customer.full_name,
                  accountNumber: account.account_number,
                };
              }

              // 4. Group approved payment amounts by YYYY-MM-DD.
              const payments: Record<string, number> = {};

              for (const payment of paymentResponse.payments) {
                if (
                  String(payment.status ?? "").toUpperCase() !== "APPROVED"
                ) {
                  continue;
                }

                // Slice the date to avoid timezone date shifting.
                const paymentDate = String(
                  payment.payment_date ?? "",
                ).slice(0, 10);
                const paymentAmount = Number(payment.amount);

                if (
                  !/^\d{4}-\d{2}-\d{2}$/.test(paymentDate) ||
                  !Number.isFinite(paymentAmount) ||
                  paymentAmount <= 0
                ) {
                  continue;
                }

                payments[paymentDate] =
                  (payments[paymentDate] ?? 0) + paymentAmount;
              }

              // Determine the current month's collection status using local time.
              const now = new Date();
              const currentMonthPrefix =
                `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-`;

              const currentMonthTotal = Object.entries(payments)
                .filter(([date]) => date.startsWith(currentMonthPrefix))
                .reduce((total, [, amount]) => total + amount, 0);

              const status: CollectionStatus =
                currentMonthTotal >= normalizedAccount.amount
                  ? "paid"
                  : "due";

              return {
                ok: true as const,
                account: {
                  ...normalizedAccount,
                  payments,
                  status,
                },
              };
            }),
          );

          const failedAccount = accountResults.find(
            (result) => !result.ok,
          );

          if (failedAccount && !failedAccount.ok) {
            return {
              error: {
                status: "CUSTOM_ERROR" as const,
                error:
                  `Could not load payment history for ` +
                  `${failedAccount.customerName} ` +
                  `(${failedAccount.accountNumber}).`,
              },
            };
          }

          return {
            data: accountResults.flatMap((result) =>
              result.ok ? [result.account] : [],
            ),
          };
        } catch (error: unknown) {
          return {
            error: {
              status: "CUSTOM_ERROR" as const,
              error:
                error instanceof Error
                  ? error.message
                  : "Unable to load customer collection accounts.",
            },
          };
        }
      },

      providesTags: (result) => [
        "Customer",
        "Collection",
        ...(result ?? []).map((account) => ({
          type: "Customer" as const,
          id: account.customerId,
        })),
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateCustomerMutation,
  useCreateAccountMutation,

  useGetCustomerDetailsQuery,
  useLazyGetCustomerDetailsQuery,

  useListCustomersQuery,
  useLazyListCustomersQuery,

  useGetCollectionAccountsQuery,

  useAddAdminCollectionMutation,
} = customerApi;
