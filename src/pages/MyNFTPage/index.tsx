import { useEffect, useState } from 'react';
import Spin from 'antd/lib/spin';
import PageLayout from 'src/components/PageLayout';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Card from 'antd/lib/card';
import Title from 'antd/lib/typography/Title';
import { getNFTList } from 'src/apis/nft';
import Image from 'src/components/Image';
import { formatAddress } from 'src/helpers/wallet';
import { useWeb3React } from '@web3-react/core';
import { INFTParsedTokenAccount, NFTStandard } from 'src/interfaces/nft';
import Button from 'src/components/Button';
import ReloadOutlined from '@ant-design/icons/ReloadOutlined';
import MyNFTPageStyle from './style';

const MyNFTPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { account, chainId } = useWeb3React();
  const [nftStandard, setNftStandard] = useState(NFTStandard.ERC_721);
  const [items, setItems] = useState<INFTParsedTokenAccount[]>([]);

  const fetchNFT = async () => {
    if (account && chainId) {
      setLoading(true);
      getNFTList(chainId, account, nftStandard)
        .then((data) => {
          setItems(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error(error.response);
        });
    }
  };

  useEffect(() => {
    fetchNFT();
  }, [nftStandard, account, chainId]);

  return (
    <MyNFTPageStyle>
      <PageLayout>
        <div className='header'>
          <Title level={2}>My NFT</Title>
        </div>
        <div className='reload-container'>
          <Button className='reload-button' shape='round' onClick={fetchNFT}>
            <ReloadOutlined /> Reload
          </Button>
        </div>
        {loading ? (
          <div className='loading-container'>
            <Spin size='large' />
            <Title level={5}>Loading available tokens</Title>
          </div>
        ) : items.length > 0 ? (
          <Row gutter={[0, 16]} className='image-container'>
            {items.map((item, index) => (
              <Col span={6} key={index}>
                <Card
                  hoverable
                  cover={
                    <Image
                      width='100%'
                      height={150}
                      alt={item.name!}
                      src={item.image!}
                    />
                  }
                >
                  <Title level={5} ellipsis>
                    {item.name}
                  </Title>
                  <Title level={5}>#{item.tokenId}</Title>
                  <p>{formatAddress(item.contractAddress, 6)}</p>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className='no-data-container'>
            <Title level={2} style={{ color: '#a3a3a3' }}>
              No Data
            </Title>
          </div>
        )}
      </PageLayout>
    </MyNFTPageStyle>
  );
};

export default MyNFTPage;
