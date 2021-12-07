import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Spin from 'antd/lib/spin';
import { getRedirectUrl } from 'src/helpers';

const LogoutPage: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const redirectUrl = getRedirectUrl() || '/';
    history.push(redirectUrl);
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

export default LogoutPage;
