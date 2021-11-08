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
import { useEffect, useState } from 'react';
import { getTransferStatus } from 'src/apis/nft';
import { TransferStatus } from 'src/helpers/nft';
import TransferStatusLabel from '../TransferStatusLabel';

const TransferNFT: React.FC = () => {
  const { chainId } = useWeb3React();
  const nft = useRecoilValue(nftState);
  const [txHash, setTxHash] = useState('');
  const bridgeAddress = useRecoilValue(bridgeAddressState);
  const [transferStatus, setTransferStatus] = useState(TransferStatus.NotStart);
  const { contractAddress: tokenAddress, tokenId, walletAddress } = nft!;

  const chainData = getChainDataByChainId(chainId);

  const checkStatus = async () => {
    const status = await getTransferStatus(walletAddress, txHash);
    setTransferStatus(status);
  };

  useEffect(() => {
    if (transferStatus === TransferStatus.InProgress) {
      const interval = setInterval(checkStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [transferStatus]);

  const transfer = async () => {
    const transferTxHash = await contractErc721.transferToken(
      chainData.swapAgentAddress,
      tokenAddress,
      bridgeAddress.targetAddress,
      tokenId!,
      getChainId(bridgeAddress.targetChain!)
    );
    if (transferTxHash) {
      setTxHash(transferTxHash);
      setTransferStatus(TransferStatus.InProgress);
      message.success('Transfer in progress...');
    } else {
      message.error('Something went wrong!');
    }
  };

  return (
    <TransferNFTStyle>
      {transferStatus === TransferStatus.NotStart && (
        <>
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
        </>
      )}
      {transferStatus !== TransferStatus.NotStart && (
        <div className='progress-container'>
          <p className='status-label'>Status: </p>
          <TransferStatusLabel status={transferStatus} />
        </div>
      )}
    </TransferNFTStyle>
  );
};

export default TransferNFT;
