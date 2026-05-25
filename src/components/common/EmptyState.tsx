interface EmptyStateProps {
  message?: string;
}

function EmptyState({ message = "No data available." }: EmptyStateProps) {
  return <p className="common-state common-state--empty">{message}</p>;
}

export default EmptyState;
