"use client";

import { useState, useEffect, useCallback } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { TabsBar } from "@/components/layout/TabsBar";
import { FormRenderer } from "@/components/layout/FormRenderer";
import { HomeGrid } from "@/components/pages/HomeGrid";
import RealEstateBrokerageGrid from "@/components/pages/RealEstateBrokerageGrid";
import { useTabs } from "@/hooks/use-tabs";
import { Toaster } from "sonner";
import { User } from "@/types/backend";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const mockUser: User = {
  id: "1",
  name: "Lenzi Aziz",
  phone: "813786944",
  unreadMessages: 1,
};

const RE_FORM_KEYS = [
  "Transaction_File_Documentation_Form",
  "Third_Party_Deposit_Acknowledgement_Form",
  "Sales_Record_Sheet_Template",
  "Sales_Activity_Listing_Template",
  "Reconciling_Items_Log",
  "Monthly_Trust_Reconciliation_Checklist_Form",
  "Monthly_Trust_Account_Checklist_MonthEndCutOff",
  "Monthend_activity",
  "Compliance_Action_Register",
  "Commission_Amendment_Form",
];

export default function Dashboard() {
  const { tabs, activeTab, openTab, closeTab } = useTabs();
  const [closeConfirm, setCloseConfirm] = useState<{
    open: boolean;
    key: string;
  }>({ open: false, key: "" });

  const requestClose = useCallback(
    (key: string) => {
      if (RE_FORM_KEYS.includes(key)) {
        setCloseConfirm({ open: true, key });
      } else {
        closeTab(key);
      }
    },
    [closeTab],
  );

  const confirmClose = useCallback(() => {
    closeTab(closeConfirm.key);
    setCloseConfirm({ open: false, key: "" });
  }, [closeConfirm.key, closeTab]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "tfd-close-tab" && e.data.key) {
        requestClose(e.data.key);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [requestClose]);

  const closeTabTitle =
    tabs.find((t) => t.key === closeConfirm.key)?.title ?? "";

  return (
    <div className="h-full bg-background text-foreground flex flex-col">
      <AppHeader
        user={mockUser}
        onNavClick={openTab}
        activeKey={activeTab?.key}
      />
      <TabsBar
        tabs={tabs}
        activeKey={activeTab?.key}
        onTabClick={openTab}
        onTabClose={requestClose}
      />
      <main className="flex-1 flex flex-col min-h-0">
        {activeTab?.key === "home" || !activeTab ? (
          <div className="flex-1 overflow-auto">
            <div className="max-w-[1200px] mx-auto px-4 pb-6 pt-4">
              <div
                className="border border-border rounded-[14px] p-3"
                style={{
                  backgroundImage:
                    "radial-gradient(130% 130% at 20% 0%, #ffffff 0%, #f7f9fc 60%, #eef2f7 100%)",
                }}
              >
                <header className="px-2 pb-3 pt-1.5">
                  <h1 className="m-0 mb-1.5 text-xl font-extrabold text-foreground">
                    Welcome
                  </h1>
                  <p className="m-0 text-sm text-muted-foreground">
                    Pick a module to get started.
                  </p>
                </header>
                <HomeGrid onModuleClick={(key) => openTab(key)} />
              </div>
            </div>
          </div>
        ) : activeTab?.key === "realestate" ? (
          <RealEstateBrokerageGrid onFormClick={openTab} />
        ) : activeTab ? (
          <FormRenderer formKey={activeTab.key} />
        ) : null}
      </main>

      <Dialog
        open={closeConfirm.open}
        onOpenChange={(o) => setCloseConfirm({ open: o, key: "" })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Tab</DialogTitle>
            <DialogDescription>
              Are you sure you want to close &quot;{closeTabTitle}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">No</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmClose}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster richColors position="bottom-right" />
    </div>
  );
}
