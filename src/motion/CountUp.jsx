import { useState, useEffect, useRef } from "react";

export default function CountUp({
  target,
  duration = 1200,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);
  const elRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el || startedRef.current) return;

    function startAnimation() {
      if (startedRef.current) return;
      startedRef.current = true;

      const animate = (timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(eased * target);
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };
      frameRef.current = requestAnimationFrame(animate);
    }

    // Check if already in viewport immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          startAnimation();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  const formatted = decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString();

  return (
    <span ref={elRef} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
