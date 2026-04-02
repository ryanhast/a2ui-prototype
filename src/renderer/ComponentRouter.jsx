import DataTable from "../components/DataTable";
import MetricCard from "../components/MetricCard";
import BarChartComponent from "../components/BarChart";
import ActionCard from "../components/ActionCard";
import SummaryText from "../components/SummaryText";
import ProgressBar from "../components/ProgressBar";
import StatComparison from "../components/StatComparison";
import Callout from "../components/Callout";
import ListGroup from "../components/ListGroup";

const COMPONENT_MAP = {
  "data-table": DataTable,
  "metric-card": MetricCard,
  "bar-chart": BarChartComponent,
  "action-card": ActionCard,
  "summary-text": SummaryText,
  "progress-bar": ProgressBar,
  "stat-comparison": StatComparison,
  "callout": Callout,
  "list-group": ListGroup,
};

export default function ComponentRouter({ type, props, onAction }) {
  const Component = COMPONENT_MAP[type];

  if (!Component) {
    // Graceful fallback: render unknown types as summary text
    return (
      <SummaryText
        text={`[Unknown component type: "${type}"] ${JSON.stringify(props).slice(0, 200)}`}
      />
    );
  }

  return <Component {...props} onAction={onAction} />;
}
