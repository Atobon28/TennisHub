interface SuccessMessageProps {
  message: string;
}

function SuccessMessage({ message }: SuccessMessageProps) {
  return <p className="common-state common-state--success">{message}</p>;
}

export default SuccessMessage;
