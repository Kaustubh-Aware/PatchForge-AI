import "./ShineButton.css";

export default function ShineButton({ children, onClick, className = "", type = "button", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={"shine-btn " + className}
    >
      <span className="shine-btn__sweep" aria-hidden="true" />
      <span className="shine-btn__content">{children}</span>
    </button>
  );
}