import { useEffect, useRef, useState } from 'react';

export default function RevealSection({ enabled = true, children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setVisible(true);
      return undefined;
    }

    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  return (
    <div
      ref={ref}
      className={`inv-reveal-section${visible ? ' inv-reveal-visible' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  );
}
