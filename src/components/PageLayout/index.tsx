import { Layout } from 'antd';
import PageLayoutStyle from './style';

const { Content } = Layout;

const PageLayout: React.FC = ({ children }) => {
  return (
    <PageLayoutStyle>
      <Layout>
        {/* <PageHeader
          title={<Link to="/">NFT Bridge</Link>}
          // subTitle='Identity Link'
          // extra={[<ConnectButton key="1" />]}
        ></PageHeader> */}
        <Content>
          <div className='container'>{children}</div>
        </Content>
      </Layout>
    </PageLayoutStyle>
  );
};

export default PageLayout;
