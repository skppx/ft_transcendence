import { useEffect, useRef } from 'react';

export function useScroll(...dependencies: any[]) {
  const messageEndRef = useRef<any>(null);
  useEffect(() => {
    const scrollToBottom = () => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [dependencies]);

  return messageEndRef;
}

export default {};
