import { message } from 'antd';
import { ethers } from 'ethers';
import { Chain, ChainData } from 'src/interfaces/nft';
import setting from 'src/setting';

export const getChainList = () => {
  return [
    {
      id: Number(setting.ETH_CHAIN_ID),
      name: 'Ethereum',
      value: Chain.ETHEREUM,
      registerFee: 0.02,
      bridgeFee: 0.04,
      currency: 'ETH',
      swapAgentAddress: setting.ETH_SWAP_AGENT_CONTRACT,
    },
    {
      id: Number(setting.BSC_CHAIN_ID),
      name: 'Binance Smart Chain',
      value: Chain.BSC,
      registerFee: 0.02,
      bridgeFee: 0.04,
      currency: 'BNB',
      swapAgentAddress: setting.BSC_SWAP_AGENT_CONTRACT,
    },
  ];
};

export const getChainData = (chain: Chain): ChainData => {
  const chainList = getChainList();
  return chainList.find((item) => item.value === chain)!;
};

export const getChainDataByChainId = (chainId?: number): ChainData => {
  const chainList = getChainList();
  return chainList.find((item) => item.id === Number(chainId))!;
};

export const getChainId = (chain: Chain): number => {
  switch (chain) {
    case Chain.BSC:
      return Number(setting.BSC_CHAIN_ID);
    case Chain.ETHEREUM:
      return Number(setting.ETH_CHAIN_ID);
    default:
      return Number(setting.ETH_CHAIN_ID);
  }
};

export const requestChangeNetwork = async (chain: Chain): Promise<boolean> => {
  const provider = window.ethereum;
  if (provider && provider.request) {
    const chainId = getChainId(chain);
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
          },
        ],
      });
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        message.error(`Please add ${chain} chain to your network`);
      } else {
      }
      console.error('Failed to setup the network in Metamask:', error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

export const getSigner = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum!);
  const signer = provider.getSigner();
  console.log(await signer.getAddress());
  console.log(ethers.utils.formatEther(await signer.getBalance()));
};

export const formatAddress = (address: string, showLength: number): string => {
  const length = address.length;
  return `${address.substring(0, showLength)}...${address.substring(
    length - showLength,
    length
  )}`;
};
