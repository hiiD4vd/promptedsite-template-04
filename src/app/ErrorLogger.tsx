import { useEffect } from 'react';

export default function ErrorLogger() {
  useEffect(() => {
    const handleError = (e: ErrorEvent | Event) => {
      if (e instanceof Event && e.type === 'error') {
        const target = e.target as HTMLElement;
        if (target && target.tagName) {
          console.error('GLOBAL ERROR (Element):', target.tagName, (target as any).src || (target as any).href);
          // Prevent Next.js from showing [object Event]
          e.preventDefault();
        } else {
          console.error('GLOBAL ERROR (Event):', e);
        }
      } else {
        console.error('GLOBAL ERROR:', (e as ErrorEvent).error || (e as ErrorEvent).message || e);
      }
    };
    
    window.addEventListener('error', handleError, true); // Use capture to get all element errors
    
    window.addEventListener('unhandledrejection', (e) => {
      console.error('UNHANDLED REJECTION:', e.reason);
    });
    
    return () => {
      window.removeEventListener('error', handleError, true);
    };
  }, []);
  return null;
}
