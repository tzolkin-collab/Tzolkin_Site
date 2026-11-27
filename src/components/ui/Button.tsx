import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost";

const variantClassMap: Record<ButtonVariant, string> = {
  primary: "tz-btn-primary",
  ghost: "tz-btn-ghost",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  forceHoverPreview?: boolean;
  children: ReactNode;
}

/** Architectural sharp-radius button with primary/ghost inversion states. */
export function Button({
  variant = "primary",
  forceHoverPreview = false,
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-state={forceHoverPreview ? "hover" : undefined}
      className={`${variantClassMap[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
}

/** Link styled identically to Button for navigation and primary CTAs. */
export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal) {
    return (
      <Link
        href={href}
        className={`${variantClassMap[variant]} ${className}`.trim()}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={`${variantClassMap[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </a>
  );
}
