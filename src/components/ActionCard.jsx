export default function ActionCard({ title, description, actions = [], onAction }) {
  return (
    <div className="flex flex-col gap-3 py-4 border-t border-black/15 first:border-t-0">
      <h4 className="text-base font-bold leading-snug">{title}</h4>
      <p className="text-sm leading-relaxed opacity-70">
        {description}
      </p>
      {actions.length > 0 && (
        <div className="flex gap-2 flex-wrap pt-1">
          {actions.map((action, i) =>
            action.variant === "primary" ? (
              <button
                key={i}
                onClick={() => onAction?.(action.label)}
                className="px-4 py-2 bg-black/85 text-white text-[12px] font-medium rounded-sm hover:bg-black transition-colors focus:outline-2 focus:outline-black focus:outline-offset-2"
              >
                {action.label}
              </button>
            ) : (
              <button
                key={i}
                onClick={() => onAction?.(action.label)}
                className="px-4 py-2 border border-black/35 text-[12px] font-medium rounded-sm hover:bg-black/8 transition-colors focus:outline-2 focus:outline-black focus:outline-offset-2"
              >
                {action.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
