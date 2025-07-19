import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import Admin from '../About/Admin/Admin';

export function RequireAdminAuth({ children }) {
  //Admin auth wrapper
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(
        (data) => data.signInUserSession.accessToken.payload['cognito:groups']
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

  return isAuth && <Admin />;
}
