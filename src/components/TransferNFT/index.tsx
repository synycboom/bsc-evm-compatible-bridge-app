import Button from 'src/components/Button';
import Alert from 'antd/lib/alert';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import { getChainDataByChainId, getChainId } from 'src/helpers/wallet';
import { useWeb3React } from '@web3-react/core';
import contractErc721 from 'src/contract/erc721';
import message from 'antd/lib/message';

import TransferNFTStyle from './style';
import { bridgeAddressState, nftState } from 'src/state/bridge';
import { useRecoilValue } from 'recoil';

const TransferNFT: React.FC = () => {
  const { chainId } = useWeb3React();
  const nft = useRecoilValue(nftState);
  const bridgeAddress = useRecoilValue(bridgeAddressState);
  const { contractAddress: tokenAddress, tokenId } = nft!;

  const chainData = getChainDataByChainId(chainId);

  const transfer = async () => {
    const isTransfer = await contractErc721.transferToken(
      chainData.swapAgentAddress,
      tokenAddress,
      bridgeAddress.targetAddress,
      tokenId!,
      getChainId(bridgeAddress.targetChain!)
    );
    if (isTransfer) {
      message.success('Transfer in progress...');
    } else {
      message.success('Register NFT successfully');
    }
  };

  return (
    <TransferNFTStyle>
      <Button
        type='primary'
        className='blue'
        style={{ marginTop: 8 }}
        shape='round'
        onClick={transfer}
      >
        Transfer
      </Button>
      <Alert
        className='transfer-token-info'
        message={
          <span>
            <ExclamationCircleOutlined />{' '}
            {`You have to pay transfer fee ${chainData.bridgeFee} ${chainData.currency}`}
          </span>
        }
        type='warning'
      />
    </TransferNFTStyle>
  );
};

export default TransferNFT;
