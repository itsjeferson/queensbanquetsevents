import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AOS_OPTIONS = {
  duration: 420,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
  mirror: false,
  anchorPlacement: 'top-bottom',
  throttleDelay: 50,
  debounceDelay: 50,
};

let initialized = false;

export function refreshInvitationAos() {
  if (typeof window === 'undefined' || !initialized) return;
  AOS.refresh();
}

export default function useInvitationAos(refreshKeys = []) {
  useEffect(() => {
    if (!initialized) {
      AOS.init(AOS_OPTIONS);
      initialized = true;
    }

    const timer = window.setTimeout(() => {
      AOS.refresh();
    }, 80);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refreshInvitationAos();
    }, 80);

    return () => window.clearTimeout(timer);
  }, refreshKeys);
}
