export function LoadingDots({
  size = 4,
  color = "var(--primary)",
  speed = 1.2,
  className = "",
  ariaLabel = "Loading",
}) {
  const style = {
    "--dot-size": `${size}px`,
    "--dot-color": color,
    "--dot-speed": `${speed}s`,
  };

  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 ${className}`}
      style={style as React.CSSProperties}
    >
      <span className="ld-dot" aria-hidden="true" />
      <span className="ld-dot" aria-hidden="true" />
      <span className="ld-dot" aria-hidden="true" />
    </span>
  );
}
