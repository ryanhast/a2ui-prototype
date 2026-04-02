import React from "react";
import FadeIn from "./FadeIn";

export default function Stagger({
  children,
  interval = 80,
  baseDelay = 0,
  direction = "up",
  duration = 400,
  className = "",
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) =>
        child ? (
          <FadeIn
            delay={baseDelay + i * interval}
            direction={direction}
            duration={duration}
          >
            {child}
          </FadeIn>
        ) : null
      )}
    </div>
  );
}
