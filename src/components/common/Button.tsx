import React from "react";
import { cn } from "../../utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className,
  disabled,
  children,
  ...props
}) => {
  const baseClasses =
    "relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white focus:ring-blue-500 hover:shadow-lg hover:shadow-blue-500/25",
    secondary:
      "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500 hover:shadow-lg hover:shadow-gray-500/25 border border-gray-600 hover:border-gray-500",
    success:
      "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white focus:ring-green-500 hover:shadow-lg hover:shadow-green-500/25",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white focus:ring-red-500 hover:shadow-lg hover:shadow-red-500/25",
    warning:
      "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white focus:ring-yellow-500 hover:shadow-lg hover:shadow-yellow-500/25",
    ghost:
      "bg-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 hover:shadow-lg hover:shadow-gray-500/25",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Button clicked!", { variant, children });
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
      type={props.type || "button"}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        "focus-ring",
        "hover:scale-105 active:scale-95",
        className,
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseDown={() => console.log("Button mousedown", { variant, children })}
    >
      <span className="relative flex items-center justify-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && icon && <span className="inline-flex">{icon}</span>}
        <span>{loading ? "Loading..." : children}</span>
      </span>
    </button>
  );
};

export default Button;
