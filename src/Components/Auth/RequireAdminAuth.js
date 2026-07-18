import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus } from '../../utils/auth';

export function RequireAdminAuth({ children }) {
  //Admin auth wrapper
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    // Routed through the single auth seam (utils/auth.js) rather than calling
    // Auth.currentAuthenticatedUser() directly, so admin gating works unchanged
    // whether the session came from Amplify (prod) or the local Cognito-mimic
    // session (REACT_APP_LOCAL_AUTH=true). `data.cognitoUser` has the same
    // signInUserSession.accessToken.payload shape Auth returned directly.
    checkAuthStatus()
      .then(
        (data) =>
          data?.cognitoUser?.signInUserSession?.accessToken?.payload?.[
            'cognito:groups'
          ]
      )
      .then((group) => {
        if (group && group[0] === 'Admin') {
          setIsAuth(true);
        } else {
          navigate('/account');
        }
      })
      .catch(() => {
        navigate('/account');
      });
  }, []);

  return isAuth && children;
}
