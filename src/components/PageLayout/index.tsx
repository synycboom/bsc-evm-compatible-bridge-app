import { Button, Layout, PageHeader } from 'antd';
import PageLayoutStyle from './style';
import { useHistory } from 'react-router-dom';
import ConnectWalletButton from '../ConnectWalletButton';

const { Content } = Layout;

const PageLayout: React.FC<{ showConnectWallet?: boolean }> = ({
  children,
  showConnectWallet = true,
}) => {
  const history = useHistory();
  return (
    <PageLayoutStyle>
      <Layout>
        <PageHeader
          title={
            <span className='app-name' onClick={() => history.push('/')}>
              BIFROST
            </span>
          }
          subTitle='NFT Bridge'
          extra={[
            <Button type='link' key='1' onClick={() => history.push('/')}>
              Home
            </Button>,
            <Button type='link' key='2' onClick={() => history.push('/bridge')}>
              Bridge
            </Button>,
            <Button type='link' key='3' onClick={() => history.push('/status')}>
              Status
            </Button>,
            <Button type='link' key='3' onClick={() => history.push('/my-nft')}>
              My NFT
            </Button>,
            <ConnectWalletButton
              key='4'
              style={{ visibility: showConnectWallet ? 'visible' : 'hidden' }}
            />,
          ]}
        ></PageHeader>
        <Content>
          <div className='container'>{children}</div>
        </Content>
      </Layout>
    </PageLayoutStyle>
  );
};

export default PageLayout;
