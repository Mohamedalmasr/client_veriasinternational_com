import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Forms",
  description: "Real Estate Brokerage Forms",
};

export default function RealEstateBrokerageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
