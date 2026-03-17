import type { ButtonHTMLAttributes } from "react";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "small";
};

export function ActionButton({
  variant = "primary",
  className = "",
  ...props
}: ActionButtonProps) {
  const variantClass = variant === "primary" ? "btn" : `btn btn-${variant}`;
  return <button className={`${variantClass} ${className}`.trim()} {...props} />;
}
