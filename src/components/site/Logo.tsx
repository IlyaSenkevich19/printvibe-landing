import logo from "@/assets/brand/logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="PrintVibe"
      width={700}
      height={150}
      decoding="async"
      className={`h-auto mix-blend-multiply ${className}`}
    />
  );
}
