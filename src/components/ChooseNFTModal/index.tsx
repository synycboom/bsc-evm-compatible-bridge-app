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
import Input from 'antd/lib/input';
import Button from 'src/components/Button';
import { formatAddress } from 'src/helpers/wallet';
import ChooseNFTModalStyle from './style';
import {
  INFTParsedTokenAccount,
  NFTStandard,
  NFT_STANDARD_OPTIONS,
} from 'src/interfaces/nft';
import { useSetRecoilState } from 'recoil';
import { nftState } from 'src/state/bridge';
import contract721 from 'src/contract/erc721';
import * as api from 'src/apis/nft';
import { message } from 'antd';
import contractErc1155 from 'src/contract/erc1155';
import { EMPTY_NFT_DATA } from 'src/constants/nft';

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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [items, setItems] = useState<INFTParsedTokenAccount[]>([]);
  const [isManual, setIsManual] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [tokenId, setTokenId] = useState<number | null>();
  const setNft = useSetRecoilState(nftState);

  const clear = () => {
    setContractAddress('');
    setTokenId(null);
    setIsManual(false);
    setNftStandard(NFTStandard.ERC_721);
    setLoading(false);
    setConfirmLoading(false);
  };

  const onClose = () => {
    onCancel();
    clear();
  };

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

  const onSelected = (item: INFTParsedTokenAccount) => {
    setNft(item);
    onClose();
  };

  const confirmToken721 = async () => {
    if (tokenId && contractAddress) {
      const tokenUri = await contract721.getTokenUri(contractAddress, tokenId);
      if (!tokenUri) return;
      const data = await api.getDataFromTokenUri(tokenUri);
      if (!data) {
        message.error('Something went wrong');
        return;
      }
      const nftData: INFTParsedTokenAccount = {
        ...EMPTY_NFT_DATA,
        tokenId: tokenId.toString(),
        uri: tokenUri,
        image: data.image,
        nftName: data.name,
        description: data.description,
        walletAddress: account!,
        contractAddress: contractAddress,
        name: data.name,
        standard: NFTStandard.ERC_721,
        chainId: chainId!,
      };
      setNft(nftData);
      onClose();
    }
  };

  const confirmToken1155 = async () => {
    if (tokenId && contractAddress) {
      const tokenUri = await contractErc1155.getTokenUri(
        contractAddress,
        tokenId
      );
      if (!tokenUri) return;
      const data = await api.getDataFromTokenUri(tokenUri);

      if (!data) {
        message.error('Something went wrong');
        return;
      }
      const nftData: INFTParsedTokenAccount = {
        ...EMPTY_NFT_DATA,
        tokenId: tokenId.toString(),
        uri: tokenUri,
        image: data.image,
        nftName: data.name,
        description: data.description,
        walletAddress: account!,
        contractAddress: contractAddress,
        name: data.name,
        standard: NFTStandard.ERC_1155,
        chainId: chainId!,
      };
      setNft(nftData);
      onClose();
    }
  };

  const confirmToken = async () => {
    setConfirmLoading(true);
    if (nftStandard === NFTStandard.ERC_721) {
      await confirmToken721();
    } else if (nftStandard === NFTStandard.ERC_1155) {
      await confirmToken1155();
    }
    setConfirmLoading(false);
  };

  useEffect(() => {
    fetchNFT();
  }, [nftStandard, account, chainId]);

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
              hidden={isManual}
              onClick={fetchNFT}
            >
              <RedoOutlined />
            </Button>
          </div>
          <Button
            type='link'
            className='manual-button'
            hidden={isManual}
            onClick={() => setIsManual(true)}
          >
            Add token manually
          </Button>
        </>
      }
      visible={visible}
      onOk={onOk}
      onCancel={onClose}
      closeIcon={<CloseCircleOutlined />}
    >
      {isManual ? (
        <Row className='manual-container' gutter={[0, 16]}>
          <Col span={7}>
            <p>Token Address: </p>
          </Col>
          <Col span={17}>
            <Input onChange={(e) => setContractAddress(e.target.value)} />
          </Col>
          <Col span={7}>
            <p>Token ID: </p>
          </Col>
          <Col span={17}>
            <Input
              type='number'
              onChange={(e) => setTokenId(Number(e.target.value))}
            />
          </Col>
          <Col span={13}></Col>
          <Col span={5}>
            <Button
              type='primary'
              danger
              block
              shape='round'
              onClick={() => setIsManual(false)}
            >
              Cancel
            </Button>
          </Col>
          <Col span={1}></Col>
          <Col span={5}>
            <Button
              type='primary'
              block
              shape='round'
              onClick={confirmToken}
              loading={confirmLoading}
            >
              Confirm
            </Button>
          </Col>
        </Row>
      ) : (
        <div
          style={{
            height: 400,
          }}
        >
          {loading ? (
            <div className='loading-container'>
              <LoadingOutlined />
              <Title level={5}>Loading available tokens</Title>
            </div>
          ) : items.length > 0 ? (
            <Row gutter={[0, 16]} className='image-container'>
              {items.map((item, index) => (
                <Col span={8} key={index}>
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
            <div className='no-data-container'>
              <Title level={2} style={{ color: '#a3a3a3' }}>
                No Data
              </Title>
            </div>
          )}
        </div>
      )}
    </ChooseNFTModalStyle>
  );
};

export default ChooseNFTModal;
