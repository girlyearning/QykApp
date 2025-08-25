import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';

export const useBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const setupBackButtonHandler = async () => {
      // Handle hardware back button
      const backButtonListener = await App.addListener('backButton', () => {
        // If we're on the home page, minimize the app instead of closing
        if (location.pathname === '/') {
          App.minimizeApp();
          return;
        }

        // For all other pages, navigate back within the app
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate('/');
        }
      });

      return backButtonListener;
    };

    let listener: any;
    setupBackButtonHandler().then((backButtonListener) => {
      listener = backButtonListener;
    });

    // Cleanup
    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [navigate, location.pathname]);
};