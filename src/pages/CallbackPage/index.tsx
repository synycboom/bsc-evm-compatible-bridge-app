import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Spin from 'antd/lib/spin';
import { getRedirectUrl } from 'src/helpers';
import ud from 'src/helpers/ud';

const CallbackPage: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const uauth = ud();

    // Try to exchange authorization code for access and id tokens.
    uauth
      .loginCallback()
      // Successfully logged and cached user in `window.localStorage`
      .then(() => {
        const redirectUrl: string = getRedirectUrl() || '/';
        history.push(redirectUrl);
      })
      // Failed to exchange authorization code for token.
      .catch((error) => {
        console.error('callback error:', error);
      });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin size='large' />
    </div>
  );
};

export default CallbackPage;
