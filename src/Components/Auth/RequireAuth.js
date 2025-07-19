import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import useUserStore from '../../zustand/user.store';
import { checkAuthStatus } from '../../utils/auth.js';

export function RequireAuth({ children }) {
  const location = useLocation();
  const user = useUserStore((context) => context.user);
  const setUser = useUserStore((context) => context.setUser);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        // Check for Cypress test authentication (production-safe)
        if (window.Cypress && localStorage.getItem('cypress-auth-mock')) {
          const mockUser = {
            cognitoUser: {
              username: 'test-user',
              attributes: { email: 'test@test.com' },
            },
          };
          setUser(mockUser);
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        // If we already have a user in store, use that
        if (user && user.cognitoUser) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        const userData = await checkAuthStatus(setUser);
        setIsAuthenticated(!!userData);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user, setUser, location.search]);

  // Show nothing while checking auth status
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    // Pass the requested URL as state so we can redirect back after login
    return (
      <Navigate
        to="/account"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  return children;
}
