import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Radio from 'antd/lib/radio';
import Card from 'antd/lib/card';
import Title from 'antd/lib/typography/Title';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { getNFTList } from 'src/apis/nft';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import RedoOutlined from '@ant-design/icons/RedoOutlined';
import Image from 'src/components/Image';
import { Button, message } from 'antd';
import { formatAddress } from 'src/helpers/wallet';
import ChooseNFTModalStyle from './style';
import {
  INFTParsedTokenAccount,
  NFTStandard,
  NFT_STANDARD_OPTIONS,
} from 'src/interfaces/nft';
import { useSetRecoilState } from 'recoil';
import { nftState } from 'src/state/bridge';

type ChooseNFTModalPropType = {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
};

const ChooseNFTModal: React.FC<ChooseNFTModalPropType> = ({
  visible,
  onOk,
  onCancel,
}: any) => {
  const { account, chainId } = useWeb3React();
  const [nftStandard, setNftStandard] = useState(NFTStandard.ERC_721);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<INFTParsedTokenAccount[]>([]);
  const setNft = useSetRecoilState(nftState);

  const fetchNFT = async () => {
    if (account && chainId) {
      setLoading(true);
      getNFTList(chainId, account, nftStandard)
        .then((data) => {
          setItems(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          message.error('something went wrong!');
        });
    }
  };

  const onSelected = (item: INFTParsedTokenAccount) => {
    setNft(item);
    onCancel();
  };

  useEffect(() => {
    fetchNFT();
  }, [nftStandard, account, chainId]);
  console.log(items);

  return (
    <ChooseNFTModalStyle
      title={
        <>
          <Title level={5} style={{ marginBottom: 16 }}>
            NFT on {account}
          </Title>
          <div className='search-container'>
            <Radio.Group
              options={NFT_STANDARD_OPTIONS}
              onChange={(e) => setNftStandard(e.target.value)}
              value={nftStandard}
              optionType='button'
              buttonStyle='solid'
            />
            <Button
              style={{ padding: 0, height: 32, width: 32 }}
              shape='round'
              size='large'
              onClick={fetchNFT}
            >
              <RedoOutlined />
            </Button>
          </div>
        </>
      }
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      closeIcon={<CloseCircleOutlined />}
    >
      <div
        style={{
          height: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {loading ? (
          <div className='loading-container'>
            <LoadingOutlined />
            <Title level={5}>Loading available tokens</Title>
          </div>
        ) : items.length > 0 ? (
          <Row gutter={[0, 16]}>
            {items.map((item) => (
              <Col span={8} key={item.tokenId}>
                <Card
                  hoverable
                  onClick={() => onSelected(item)}
                  cover={
                    <Image
                      width={170}
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
                  <p>{formatAddress(item.contractAddress, 4)}</p>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Title level={2} style={{ color: '#a3a3a3' }}>
            No Data
          </Title>
        )}
      </div>
    </ChooseNFTModalStyle>
  );
};

export default ChooseNFTModal;
