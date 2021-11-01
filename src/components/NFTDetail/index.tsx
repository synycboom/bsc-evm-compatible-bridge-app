import Title from 'antd/lib/typography/Title';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Image from 'src/components/Image';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import NFTDetailStyle from './style';
import { nftState } from 'src/state/bridge';
import { useRecoilState } from 'recoil';
import { getChainData } from 'src/helpers/wallet';
import { getNFTStandard } from 'src/helpers/nft';
import { useEffect, useState } from 'react';
import { getIsNftRegistered } from 'src/apis/nft';

enum NftStatus {
  Loading = 'loading',
  NotRegister = 'not_register',
  NotApprove = 'not_approve',
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
  const [nftStatus, setNftStatus] = useState<NftStatus>(NftStatus.Loading);
  const { name, image, contractAddress, tokenId, chain, standard } = nft!;

  const validate = (): boolean => {
    return true;
  };

  const validateAndNext = () => {
    if (validate()) {
      next();
    }
  };

  useEffect(() => {
    async function checkNftStatus() {
      const isRegister = await getIsNftRegistered(
        getChainData(chain).id,
        contractAddress
      );
      if (isRegister) {
        setNftStatus(NftStatus.NotApprove);
      } else {
        setNftStatus(NftStatus.NotRegister);
      }
    }

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
          <Image src={image!} alt={name!} width='100%' height={200} />
        </Col>
        <Col span={12} className='detail-container'>
          <Title level={5}>Name</Title>
          <p className='detail'>{name}</p>
          <Title level={5}>Contract Address</Title>
          <p className='detail'>{contractAddress}</p>
          <Title level={5}>Token ID</Title>
          <p className='detail'>{tokenId}</p>
          <Title level={5}>Token Standard</Title>
          <p className='detail'>{getNFTStandard(standard).label}</p>
          <Title level={5}>Blockchain</Title>
          <p className='detail'>{getChainData(chain).name}</p>
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
        {nftStatus === NftStatus.NotRegister && (
          <Button
            type='primary'
            shape='round'
            onClick={() => setNftStatus(NftStatus.NotApprove)}
            hidden={disabled}
          >
            Register NFT
          </Button>
        )}
        {nftStatus === NftStatus.NotApprove && (
          <Button
            type='primary'
            shape='round'
            onClick={() => setNftStatus(NftStatus.Ready)}
            hidden={disabled}
          >
            Approve NFT
          </Button>
        )}
        {nftStatus === NftStatus.Ready && (
          <Button
            type='primary'
            shape='round'
            onClick={validateAndNext}
            hidden={disabled}
          >
            Next
          </Button>
        )}
      </div>
    </NFTDetailStyle>
  );
};

export default NFTDetail;
