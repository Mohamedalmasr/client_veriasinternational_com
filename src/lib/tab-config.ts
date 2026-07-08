import { TabMap } from '@/types/tabs';

export const TAB_MAP: TabMap = {
  home: { title: 'Home', href: '/' },
  crm: { title: 'CRM', href: '/crm', navHref: '/crm' },
  accounting: { title: 'Accounting', href: '/accounting', navHref: '/accounting' },
  documents: { title: 'Documents', href: '/documents', navHref: '/documents' },
  realestate: { title: 'Real Estate Brokerage', href: '/Real_Estate_Brokerage', navHref: '/Real_Estate_Brokerage' },
  project: { title: 'Project', href: '/project' },
  teams: { title: 'Teams', href: '#' },
  property: { title: 'Property Management', href: '#' },
  Transaction_File_Documentation_Form: { title: 'Transaction_File_Documentation_Form', href: '/Real_Estate_Brokerage/Transaction_File_Documentation_Form' },
  Third_Party_Deposit_Acknowledgement_Form: { title: 'Third_Party_Deposit_Acknowledgement_Form', href: '/Real_Estate_Brokerage/Third_Party_Deposit_Acknowledgement_Form' },
  Sales_Record_Sheet_Template: { title: 'Sales_Record_Sheet_Template', href: '/Real_Estate_Brokerage/Sales_Record_Sheet_Template' },
  Sales_Activity_Listing_Template: { title: 'Sales_Activity_Listing_Template', href: '/Real_Estate_Brokerage/Sales_Activity_Listing_Template' },
  Reconciling_Items_Log: { title: 'Reconciling_Items_Log', href: '/Real_Estate_Brokerage/Reconciling_Items_Log' },
  Monthly_Trust_Reconciliation_Checklist_Form: { title: 'Monthly_Trust_Reconciliation_Checklist_Form', href: '/Real_Estate_Brokerage/Monthly_Trust_Reconciliation_Checklist_Form' },
  Monthly_Trust_Account_Checklist_MonthEndCutOff: { title: 'Monthly_Trust_Account_Checklist_MonthEndCutOff', href: '/Real_Estate_Brokerage/Monthly_Trust_Account_Checklist_MonthEndCutOff' },
  Monthend_activity: { title: 'Monthend_activity', href: '/Real_Estate_Brokerage/Monthend_activity' },
  Compliance_Action_Register: { title: 'Compliance_Action_Register', href: '/Real_Estate_Brokerage/Compliance_Action_Register' },
  Commission_Amendment_Form: { title: 'Commission_Amendment_Form', href: '/Real_Estate_Brokerage/Commission_Amendment_Form' },
};

export function getTabConfig(key: string) {
  return TAB_MAP[key] || { title: key, href: '#' };
}
