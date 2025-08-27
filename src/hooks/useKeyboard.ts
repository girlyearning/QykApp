import { useEffect, useState } from 'react';

interface KeyboardState {
  isOpen: boolean;
  height: number;
}

export const useKeyboard = () => {
  const [keyboard, setKeyboard] = useState<KeyboardState>({
    isOpen: false,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      // Detect keyboard open/close on mobile devices
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.documentElement.clientHeight,
        document.body.clientHeight
      );
      const heightDifference = Math.max(0, documentHeight - windowHeight);
      
      // Threshold to determine if keyboard is open (adjust as needed)
      const keyboardThreshold = 150;
      const isKeyboardOpen = heightDifference > keyboardThreshold;
      
      setKeyboard({
        isOpen: isKeyboardOpen,
        height: isKeyboardOpen ? heightDifference : 0,
      });

      // Apply body classes for keyboard state
      if (isKeyboardOpen) {
        document.body.classList.add('keyboard-open');
        document.body.style.setProperty('--keyboard-height', `${heightDifference}px`);
      } else {
        document.body.classList.remove('keyboard-open');
        document.body.style.removeProperty('--keyboard-height');
      }
    };

    // Initial check
    handleResize();

    // Listen for resize events (passive for perf)
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize);

    // Visual viewport API support for better keyboard detection
    if ('visualViewport' in window) {
      const visualViewport = window.visualViewport as any;
      
      const handleViewportChange = () => {
        const keyboardHeight = window.innerHeight - visualViewport.height;
        const isKeyboardOpen = keyboardHeight > 150;
        
        setKeyboard({
          isOpen: isKeyboardOpen,
          height: keyboardHeight,
        });

        if (isKeyboardOpen) {
          document.body.classList.add('keyboard-open');
          document.body.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
        } else {
          document.body.classList.remove('keyboard-open');
          document.body.style.removeProperty('--keyboard-height');
        }
      };

      visualViewport.addEventListener('resize', handleViewportChange);
      
      return () => {
        visualViewport.removeEventListener('resize', handleViewportChange);
        window.removeEventListener('resize', handleResize as any);
        window.removeEventListener('orientationchange', handleResize);
        document.body.classList.remove('keyboard-open');
        document.body.style.removeProperty('--keyboard-height');
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize as any);
      window.removeEventListener('orientationchange', handleResize);
      document.body.classList.remove('keyboard-open');
      document.body.style.removeProperty('--keyboard-height');
    };
  }, []);

  return keyboard;
};

// Utility function to handle input focus for better UX
export const useInputFocus = () => {
  const scrollToInput = (element: HTMLElement) => {
    // Small delay to ensure keyboard is shown
    setTimeout(() => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 300);
  };

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    scrollToInput(event.target);
  };

  return { handleInputFocus, scrollToInput };
};