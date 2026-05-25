interface LoadingStateProps {
  message?: string;
}

function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return <p className="common-state common-state--loading">{message}</p>;
}

export default LoadingState;
