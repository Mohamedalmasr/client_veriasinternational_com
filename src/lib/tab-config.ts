import { TabMap } from '@/types/tabs';

export const TAB_MAP: TabMap = {
  home: { title: 'Home', href: '/', navHref: '/' },
  crm: { title: 'CRM', href: '/crm', navHref: '/crm' },
  accounting: { title: 'Accounting', href: '/accounting', navHref: '/accounting' },
  documents: { title: 'Documents', href: '/documents', navHref: '/documents' },
  realestate: { title: 'Real Estate Brokerage', href: '/real-estate', navHref: '/real-estate' },

  Transaction_File_Documentation_Form: { title: 'Transaction File Documentation', href: '/real-estate/transaction-file-documentation' },
  Third_Party_Deposit_Acknowledgement_Form: { title: 'Third Party Deposit Acknowledgement', href: '/real-estate/third-party-deposit-acknowledgement' },
  Sales_Record_Sheet_Template: { title: 'Sales Record Sheet', href: '/real-estate/sales-record-sheet' },
  Sales_Activity_Listing_Template: { title: 'Sales Activity Listing', href: '/real-estate/sales-activity-listing' },
  Reconciling_Items_Log: { title: 'Reconciling Items Log', href: '/real-estate/reconciling-items-log' },
  Monthly_Trust_Reconciliation_Checklist_Form: { title: 'Monthly Trust Reconciliation Checklist', href: '/real-estate/monthly-trust-reconciliation-checklist' },
  Monthly_Trust_Account_Checklist_MonthEndCutOff: { title: 'Trust Account Month-End Cutoff', href: '/real-estate/monthly-trust-account-checklist' },
  Monthend_activity: { title: 'Month-End Activity', href: '/real-estate/monthend-activity' },
  Compliance_Action_Register: { title: 'Compliance Action Register', href: '/real-estate/compliance-action-register' },
  Commission_Amendment_Form: { title: 'Commission Amendment', href: '/real-estate/commission-amendment' },
};

export function getTabConfig(key: string) {
  return TAB_MAP[key] || { title: key, href: '#' };
}
