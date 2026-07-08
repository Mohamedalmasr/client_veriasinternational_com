'use client';

const forms = [
  { key: 'Transaction_File_Documentation_Form', title: 'Transaction File Documentation' },
  { key: 'Third_Party_Deposit_Acknowledgement_Form', title: 'Third-Party Deposit Acknowledgement' },
  { key: 'Sales_Record_Sheet_Template', title: 'Sales Record Sheet' },
  { key: 'Sales_Activity_Listing_Template', title: 'Sales Activity Listing' },
  { key: 'Reconciling_Items_Log', title: 'Reconciling Items Log' },
  { key: 'Monthly_Trust_Reconciliation_Checklist_Form', title: 'Monthly Trust Reconciliation' },
  { key: 'Monthly_Trust_Account_Checklist_MonthEndCutOff', title: 'Trust Account Month-End Cutoff' },
  { key: 'Monthend_activity', title: 'Month-End Activity' },
  { key: 'Compliance_Action_Register', title: 'Compliance Action Register' },
  { key: 'Commission_Amendment_Form', title: 'Commission Amendment' },
];

interface RealEstateBrokerageGridProps {
  onFormClick: (key: string) => void;
}

export default function RealEstateBrokerageGrid({ onFormClick }: RealEstateBrokerageGridProps) {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Real Estate Brokerage</h1>
        <p className="text-sm text-muted-foreground mb-6">{forms.length} forms and documents</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map(form => (
            <button
              key={form.key}
              onClick={() => onFormClick(form.key)}
              className="flex flex-col items-center justify-center gap-1.5 min-h-[90px] px-3 py-2.5 rounded-xl border border-primary/20 bg-white shadow-sm hover:border-primary hover:bg-[#f7fbff] hover:-translate-y-0.5 transition-all duration-100 cursor-pointer font-bold text-center"
            >
              <div className="text-sm leading-snug">{form.title}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
