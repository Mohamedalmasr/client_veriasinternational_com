"use client";

import { useState, useEffect, useCallback } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { TabsBar } from "@/components/layout/TabsBar";
import { TabsProvider, useTabsContext } from "@/contexts/TabsContext";
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

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { tabs, activeKey, openTab, closeTab } = useTabsContext();
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
      <AppHeader user={mockUser} onNavClick={openTab} activeKey={activeKey} />
      <TabsBar
        tabs={tabs}
        activeKey={activeKey}
        onTabClick={openTab}
        onTabClose={requestClose}
      />
      <main className="flex-1 flex flex-col min-h-0">
        {children}
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
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TabsProvider>
      <AppShellInner>{children}</AppShellInner>
    </TabsProvider>
  );
}
