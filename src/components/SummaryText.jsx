export default function SummaryText({ text, emphasis = [] }) {
  if (!emphasis.length) {
    return <p className="text-sm text-text-secondary leading-relaxed">{text}</p>;
  }

  // Bold the emphasis phrases
  let parts = [text];
  for (const phrase of emphasis) {
    const newParts = [];
    for (const part of parts) {
      if (typeof part !== "string") {
        newParts.push(part);
        continue;
      }
      const idx = part.indexOf(phrase);
      if (idx === -1) {
        newParts.push(part);
      } else {
        if (idx > 0) newParts.push(part.slice(0, idx));
        newParts.push(
          <strong key={phrase} className="text-text font-medium">
            {phrase}
          </strong>
        );
        if (idx + phrase.length < part.length)
          newParts.push(part.slice(idx + phrase.length));
      }
    }
    parts = newParts;
  }

  return <p className="text-sm text-text-secondary leading-relaxed">{parts}</p>;
}
