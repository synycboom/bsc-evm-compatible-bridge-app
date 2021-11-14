import Title from 'antd/lib/typography/Title';
import Button from 'src/components/Button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Image from 'src/components/Image';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import { bridgeAddressState, nftState } from 'src/state/bridge';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getChainDataByChainId, useChainList } from 'src/helpers/wallet';
import { getNFTStandard } from 'src/helpers/nft';
import { useEffect, useState } from 'react';
import { getIsNft1155Registered, getIsNftRegistered } from 'src/apis/nft';
import contractErc721 from 'src/contract/erc721';
import contractErc1155 from 'src/contract/erc1155';
import Alert from 'antd/lib/alert';
import { message } from 'antd';
import { NFTStandard } from 'src/interfaces/nft';
import { EMPTY_NFT_DATA } from 'src/constants/nft';
import Input from 'antd/lib/input';
import NFTDetailStyle from './style';

enum NftStatus {
  Loading = 'loading',
  NotApprove = 'not_approve',
  NotRegister = 'not_register',
  Ready = 'Ready',
}

type NFTDetailPropType = {
  disabled: boolean;
  next: () => void;
};

const NFTDetail: React.FC<NFTDetailPropType> = ({
  disabled,
  next,
}: {
  disabled: boolean;
  next: () => void;
}) => {
  const [nft, setNft] = useRecoilState(nftState);
  const bridgeAddress = useRecoilValue(bridgeAddressState);
  const [nftStatus, setNftStatus] = useState<NftStatus>(NftStatus.Loading);
  const chainList = useChainList();

  const {
    name,
    image,
    contractAddress: tokenAddress,
    tokenId,
    chainId,
    standard,
    walletAddress,
    uiAmount,
  } = nft;
  const chainData = getChainDataByChainId(chainList, chainId);
  const validate = (): boolean => {
    if (standard === NFTStandard.ERC_1155 && !uiAmount) {
      message.error('Please fill token amount!');
      return false;
    }
    return true;
  };

  const validateAndNext = () => {
    if (validate()) {
      next();
    }
  };

  const checkIsApproved = async () => {
    if (standard === NFTStandard.ERC_721) {
      return contractErc721.getApprove(
        chainData.swapAgent721Address,
        tokenAddress,
        tokenId!
      );
    } else if (standard === NFTStandard.ERC_1155) {
      return contractErc1155.getApprove(
        tokenAddress,
        walletAddress,
        chainData.swapAgent1155Address
      );
    }
    return false;
  };

  async function checkNftStatus() {
    const isApproved = await checkIsApproved();
    if (isApproved) {
      let isRegister;
      if (standard === NFTStandard.ERC_721) {
        isRegister = await getIsNftRegistered(
          bridgeAddress.sourceChain!,
          bridgeAddress.targetChain!,
          tokenAddress
        );
      } else if (standard === NFTStandard.ERC_1155) {
        isRegister = await getIsNft1155Registered(
          bridgeAddress.sourceChain!,
          bridgeAddress.targetChain!,
          tokenAddress
        );
      }

      if (isRegister) {
        setNftStatus(NftStatus.Ready);
      } else {
        setNftStatus(NftStatus.NotRegister);
      }
    } else {
      setNftStatus(NftStatus.NotApprove);
    }
  }

  const approve = async () => {
    setNftStatus(NftStatus.Loading);
    let isApproved;
    if (standard === NFTStandard.ERC_721) {
      isApproved = await contractErc721.approve(
        chainData.swapAgent721Address,
        tokenAddress,
        tokenId!
      );
    } else if (standard === NFTStandard.ERC_1155) {
      isApproved = await contractErc1155.approve(
        chainData.swapAgent1155Address,
        tokenAddress
      );
    }
    if (isApproved) {
      message.success('Approve NFT successfully');
      checkNftStatus();
    } else {
      setNftStatus(NftStatus.NotApprove);
    }
  };

  const register = async () => {
    setNftStatus(NftStatus.Loading);
    let isRegistered;
    if (standard === NFTStandard.ERC_721) {
      isRegistered = await contractErc721.registerToken(
        chainData.swapAgent721Address,
        tokenAddress,
        bridgeAddress.targetChain!,
        chainData.registerFee
      );
    } else if (standard === NFTStandard.ERC_1155) {
      isRegistered = await contractErc1155.registerToken(
        chainData.swapAgent1155Address,
        tokenAddress,
        bridgeAddress.targetChain!,
        chainData.registerFee
      );
    }
    if (isRegistered) {
      setNftStatus(NftStatus.Ready);
      message.success('Register NFT successfully');
    } else {
      setNftStatus(NftStatus.NotRegister);
      checkNftStatus();
    }
  };

  const setAmount = (value: number) => {
    setNft({
      ...nft,
      uiAmount: value,
    });
  };

  useEffect(() => {
    if (nft) {
      setNftStatus(NftStatus.Loading);
      checkNftStatus();
    }
  }, [nft]);

  if (!nft) return null;

  return (
    // @ts-ignore
    <NFTDetailStyle disabled={disabled}>
      <div className='nft-detail-headar'>
        <Title level={4}>NFT Details</Title>
        <Button
          type='text'
          shape='circle'
          disabled={disabled}
          onClick={() => setNft(EMPTY_NFT_DATA)}
        >
          <CloseCircleOutlined />
        </Button>
      </div>
      <Row gutter={24}>
        <Col span={12}>
          <Image src={image!} alt={name!} width='100%' />
        </Col>
        <Col span={12} className='detail-container'>
          <Title level={5}>Name</Title>
          <p className='detail'>{name}</p>
          <Title level={5}>Token Address</Title>
          <p className='detail'>{tokenAddress}</p>
          <Title level={5}>Token ID</Title>
          <p className='detail'>{tokenId}</p>
          {standard === NFTStandard.ERC_1155 && (
            <>
              <Title level={5}>Token Amount</Title>
              <Input
                type='number'
                disabled={disabled}
                className='token-amount-input'
                value={uiAmount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </>
          )}
          <Title level={5}>Token Standard</Title>
          <p className='detail'>{getNFTStandard(standard).label}</p>
          <Title level={5}>Blockchain</Title>
          <p className='detail'>{chainData.name}</p>
        </Col>
      </Row>
      <div className='action-container'>
        {nftStatus === NftStatus.Loading && (
          <Button
            type='primary'
            shape='round'
            loading
            hidden={disabled}
          ></Button>
        )}
        {nftStatus === NftStatus.NotApprove && (
          <Button
            type='primary'
            shape='round'
            onClick={approve}
            hidden={disabled}
          >
            Approve NFT
          </Button>
        )}
        {nftStatus === NftStatus.NotRegister && (
          <>
            <Button
              type='primary'
              shape='round'
              onClick={register}
              hidden={disabled}
            >
              Register NFT
            </Button>
            <p className='register-info'>
              <Alert
                type='warning'
                message={
                  <>
                    <ExclamationCircleOutlined /> You have to pay register fee{' '}
                    {chainData.registerFee} {chainData.currency}
                  </>
                }
              />
            </p>
          </>
        )}

        {nftStatus === NftStatus.Ready && (
          <>
            <Button
              type='primary'
              shape='round'
              onClick={validateAndNext}
              hidden={disabled}
            >
              Next
            </Button>
          </>
        )}
      </div>
    </NFTDetailStyle>
  );
};

export default NFTDetail;
