import { useState, useEffect } from 'react';

export const useSecureAnalytics = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [sessionStart] = useState(Date.now());

  const trackEvent = async (action, data = {}) => {
    try {
      setIsTracking(true);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('No access token available for analytics tracking');
        return;
      }

      const response = await fetch('https://localhost:8080/api/V3/analytics/track/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          data: {
            ...data,
            sessionDuration: Date.now() - sessionStart,
            timestamp: Date.now()
          }
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to track analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    } finally {
      setIsTracking(false);
    }
  };

  const trackPageView = (pageName) => {
    return trackEvent('view', { page: pageName });
  };

  const trackPurchase = (amount, items) => {
    return trackEvent('purchase', { amount, items });
  };

  const trackSearch = (query) => {
    return trackEvent('search', { query });
  };

  const trackCartAction = (action, itemId, quantity) => {
    return trackEvent(`cart_${action}`, { itemId, quantity });
  };

  const trackOrder = async (orderData) => {
    try {
      setIsTracking(true);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('No access token available for order tracking');
        return;
      }

      const response = await fetch('https://localhost:8080/api/V3/analytics/track/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to track order analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Order analytics tracking failed:', error);
    } finally {
      setIsTracking(false);
    }
  };

  const getUserAnalytics = async (userId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`https://localhost:8080/api/V3/analytics/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get user analytics:', error);
      throw error;
    }
  };

  // Auto-track page views
  useEffect(() => {
    const currentPage = window.location.pathname;
    trackPageView(currentPage);

    // Track page changes
    const handleRouteChange = () => {
      const newPage = window.location.pathname;
      trackPageView(newPage);
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackPurchase,
    trackSearch,
    trackCartAction,
    trackOrder,
    getUserAnalytics,
    isTracking
  };
}; 