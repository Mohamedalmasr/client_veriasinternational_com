import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
  async rewrites() {
    return [
      {
        source: "/real-estate",
        destination: "/Real_Estate_Brokerage",
      },
      {
        source: "/real-estate/transaction-file-documentation",
        destination: "/Real_Estate_Brokerage/transaction-file-documentation",
      },
      {
        source: "/real-estate/third-party-deposit-acknowledgement",
        destination: "/Real_Estate_Brokerage/third-party-deposit-acknowledgement",
      },
      {
        source: "/real-estate/sales-record-sheet",
        destination: "/Real_Estate_Brokerage/sales-record-sheet",
      },
      {
        source: "/real-estate/sales-activity-listing",
        destination: "/Real_Estate_Brokerage/sales-activity-listing",
      },
      {
        source: "/real-estate/reconciling-items-log",
        destination: "/Real_Estate_Brokerage/reconciling-items-log",
      },
      {
        source: "/real-estate/monthly-trust-reconciliation-checklist",
        destination: "/Real_Estate_Brokerage/monthly-trust-reconciliation-checklist",
      },
      {
        source: "/real-estate/monthly-trust-account-checklist",
        destination: "/Real_Estate_Brokerage/monthly-trust-account-checklist",
      },
      {
        source: "/real-estate/monthend-activity",
        destination: "/Real_Estate_Brokerage/monthend-activity",
      },
      {
        source: "/real-estate/compliance-action-register",
        destination: "/Real_Estate_Brokerage/compliance-action-register",
      },
      {
        source: "/real-estate/commission-amendment",
        destination: "/Real_Estate_Brokerage/commission-amendment",
      },
    ];
  },
};

export default nextConfig;
