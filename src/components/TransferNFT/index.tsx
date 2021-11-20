import Button from 'src/components/Button';
import Alert from 'antd/lib/alert';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import { getChainDataByChainId, useChainList } from 'src/helpers/wallet';
import { useWeb3React } from '@web3-react/core';
import contractErc721 from 'src/contract/erc721';
import contractErc1155 from 'src/contract/erc1155';
import message from 'antd/lib/message';

import { bridgeAddressState, nftState, stepDataState } from 'src/state/bridge';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { get721TransferData, get1155TransferStatus } from 'src/apis/nft';
import TransferStatusLabel from 'src/components/TransferStatusLabel';
import { NFTStandard, TransferStatus } from 'src/interfaces/nft';
import TextAddress from 'src/components/TextAddress';
import TransferNFTStyle from './style';
import Title from 'antd/lib/typography/Title';

const TransferNFT: React.FC = () => {
  const { chainId } = useWeb3React();
  const nft = useRecoilValue(nftState);
  const [txHash, setTxHash] = useState('');
  const [dstData, setDstData] = useState({
    tokenAddress: '',
    tokenId: '',
  });
  const bridgeAddress = useRecoilValue(bridgeAddressState);
  const [{ step, transferStatus }, setStepData] = useRecoilState(stepDataState);
  const chainList = useChainList();
  const chainData = getChainDataByChainId(chainList, chainId);

  const {
    contractAddress: tokenAddress,
    tokenId,
    walletAddress,
    standard,
    uiAmount,
  } = nft || {};

  const setTransferStatus = (value: TransferStatus) => {
    setStepData({
      step,
      transferStatus: value,
    });
  };

  const checkStatus = async () => {
    let result = null;
    if (standard === NFTStandard.ERC_721) {
      result = await get721TransferData(walletAddress, txHash);
    } else {
      result = await get1155TransferStatus(walletAddress, txHash);
    }
    const { status, dstTokenAddress, dstTokenId } = result;
    if (status === TransferStatus.Done) {
      setDstData({
        tokenAddress: dstTokenAddress,
        tokenId: dstTokenId,
      });
    }
    setTransferStatus(status);
  };

  useEffect(() => {
    if (transferStatus === TransferStatus.InProgress) {
      const interval = setInterval(checkStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [transferStatus]);

  const transfer = async () => {
    let transferTxHash;
    if (standard === NFTStandard.ERC_721) {
      transferTxHash = await contractErc721.transferToken(
        chainData.swapAgent721Address,
        tokenAddress,
        bridgeAddress.targetAddress,
        tokenId!,
        bridgeAddress.targetChain!,
        chainData.transferFee
      );
    } else if (standard === NFTStandard.ERC_1155) {
      transferTxHash = await contractErc1155.transferToken(
        chainData.swapAgent1155Address,
        tokenAddress,
        bridgeAddress.targetAddress,
        tokenId!,
        uiAmount!,
        bridgeAddress.targetChain!,
        chainData.transferFee
      );
    }
    if (transferTxHash) {
      setTxHash(transferTxHash);
      setTransferStatus(TransferStatus.InProgress);
      message.success('Request transfer success');
    } else {
      message.error('Something went wrong!');
    }
  };

  if (!nft) return null;

  return (
    <TransferNFTStyle>
      {transferStatus === TransferStatus.NotStart && (
        <>
          <Button
            type='primary'
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
                {`You have to pay transfer fee ${chainData.transferFee} ${chainData.currency}`}
              </span>
            }
            type='warning'
          />
        </>
      )}
      {transferStatus !== TransferStatus.NotStart && (
        <>
          <div className='progress-container'>
            <Title level={5}>Status: </Title>
            <TransferStatusLabel status={transferStatus} />
          </div>
          {transferStatus === TransferStatus.Done && (
            <>
              <div className='token-container'>
                <Title level={5}>Destination Token Address: </Title>{' '}
                <TextAddress address={dstData.tokenAddress} copyable />
              </div>
              {/* <div className='token-container'>
                <Title level={5}>Destination Token Id: </Title>{' '}
                {dstData.tokenId}
              </div> */}
            </>
          )}
        </>
      )}
    </TransferNFTStyle>
  );
};

export default TransferNFT;
