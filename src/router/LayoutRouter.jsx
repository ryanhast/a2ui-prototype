import FinancialLayout from "../layouts/FinancialLayout";
import ChecklistLayout from "../layouts/ChecklistLayout";
import CalendarLayout from "../layouts/CalendarLayout";
import PeopleLayout from "../layouts/PeopleLayout";
import StatusLayout from "../layouts/StatusLayout";

const LAYOUTS = {
  financial: FinancialLayout,
  checklist: ChecklistLayout,
  calendar: CalendarLayout,
  people: PeopleLayout,
  status: StatusLayout,
};

export default function LayoutRouter({ layoutType, data, summary }) {
  const Layout = LAYOUTS[layoutType];

  if (!Layout) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-text-muted">
          Unknown layout type: {layoutType}
        </p>
      </div>
    );
  }

  return <Layout data={data} summary={summary} />;
}
