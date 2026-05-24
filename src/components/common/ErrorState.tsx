interface ErrorStateProps {
  message?: string;
}

function ErrorState({ message = "Something went wrong." }: ErrorStateProps) {
  return <p className="common-state common-state--error">{message}</p>;
}

export default ErrorState;
