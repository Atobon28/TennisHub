import type { ButtonHTMLAttributes, ReactNode } from "react";

interface DangerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function DangerButton({
  children,
  className = "",
  ...props
}: DangerButtonProps) {
  return (
    <button
      type="button"
      className={`common-btn common-btn--danger ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default DangerButton;
