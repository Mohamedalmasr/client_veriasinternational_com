"use client";

import RealEstateBrokerageGrid from "@/components/pages/RealEstateBrokerageGrid";
import { useTabsContext } from "@/contexts/TabsContext";

export default function RealEstateBrokeragePage() {
  const { openTab } = useTabsContext();

  return (
    <RealEstateBrokerageGrid onFormClick={openTab} />
  );
}
