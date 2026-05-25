import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function PrimaryButton({
  children,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={`common-btn common-btn--primary ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
