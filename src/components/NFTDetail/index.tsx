import Title from 'antd/lib/typography/Title';
import Button from 'src/components/Button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Image from 'src/components/Image';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import { bridgeAddressState, nftState } from 'src/state/bridge';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getChainData, getChainId } from 'src/helpers/wallet';
import { getNFTStandard } from 'src/helpers/nft';
import { useEffect, useState } from 'react';
import { getIsNftRegistered } from 'src/apis/nft';
import contractErc721 from 'src/contract/erc721';
import Alert from 'antd/lib/alert';
import { message } from 'antd';
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
  const {
    name,
    image,
    contractAddress: tokenAddress,
    tokenId,
    chain,
    standard,
  } = nft!;
  const chainData = getChainData(chain);

  const validate = (): boolean => {
    return true;
  };

  const validateAndNext = () => {
    if (validate()) {
      next();
    }
  };

  const checkIsApproved = async () => {
    const isApproved = await contractErc721.getApprove(
      chainData.swapAgentAddress,
      tokenAddress,
      tokenId!
    );
    return isApproved;
  };

  async function checkNftStatus() {
    const isApproved = await checkIsApproved();
    if (isApproved) {
      const isRegister = await getIsNftRegistered(
        getChainId(bridgeAddress.sourceChain!),
        getChainId(bridgeAddress.targetChain!),
        tokenAddress
      );
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
    const isApproved = await contractErc721.approve(
      chainData.swapAgentAddress,
      tokenAddress,
      tokenId!
    );
    if (isApproved) {
      message.success('Approve NFT successfully');
      checkNftStatus();
    } else {
      setNftStatus(NftStatus.NotApprove);
    }
  };

  const register = async () => {
    setNftStatus(NftStatus.Loading);
    const isRegistered = await contractErc721.registerToken(
      chainData.swapAgentAddress,
      tokenAddress,
      getChainId(bridgeAddress.targetChain!)
    );
    if (isRegistered) {
      setNftStatus(NftStatus.Ready);
      message.success('Register NFT successfully');
    } else {
      setNftStatus(NftStatus.NotRegister);
      checkNftStatus();
    }
  };

  useEffect(() => {
    if (nft) {
      setNftStatus(NftStatus.Loading);
      checkNftStatus();
    }
  }, [nft]);

  return (
    // @ts-ignore
    <NFTDetailStyle disabled={disabled}>
      <div className='nft-detail-headar'>
        <Title level={4}>NFT Details</Title>
        <Button
          type='text'
          shape='circle'
          disabled={disabled}
          onClick={() => setNft(null)}
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
