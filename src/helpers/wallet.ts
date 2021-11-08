import { message } from 'antd';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { getInfo } from 'src/apis/info';
import { Chain, ChainData } from 'src/interfaces/nft';
import setting from 'src/setting';
import { chainListState, infoState } from 'src/state/info';

export const useChainList = () => {
  const [info, setInfo] = useRecoilState(infoState);
  const [chainList, setChainList] = useRecoilState(chainListState);

  useEffect(() => {
    if (!info) {
      getInfo().then((data) => {
        setInfo(data);
      });
    } else {
      setChainList([
        {
          id: info.eth_chain_id,
          name: 'Ethereum',
          value: Chain.ETHEREUM,
          registerFee: 0.02,
          bridgeFee: 0.04,
          currency: 'ETH',
          swapAgent721Address: info.eth_erc_721_swap_agent,
          swapAgent1155Address: info.eth_erc_1155_swap_agent,
        },
        {
          id: info.bsc_chain_id,
          name: 'Binance Smart Chain',
          value: Chain.BSC,
          registerFee: 0.02,
          bridgeFee: 0.04,
          currency: 'BNB',
          swapAgent721Address: info.bsc_erc_721_swap_agent,
          swapAgent1155Address: info.bsc_erc_1155_swap_agent,
        },
      ]);
    }
  }, [info]);

  return chainList;
};

// export const getChainList = () => {
//   const info = JSON.parse(localStorage.getItem('info')!);

//   return [
//     {
//       id: info.eth_chain_id,
//       name: 'Ethereum',
//       value: Chain.ETHEREUM,
//       registerFee: 0.02,
//       bridgeFee: 0.04,
//       currency: 'ETH',
//       swapAgent721Address: info.eth_erc_721_swap_agent,
//       swapAgent1155Address: info.eth_erc_1155_swap_agent,
//     },
//     {
//       id: info.bsc_chain_id,
//       name: 'Binance Smart Chain',
//       value: Chain.BSC,
//       registerFee: 0.02,
//       bridgeFee: 0.04,
//       currency: 'BNB',
//       swapAgent721Address: info.bsc_erc_721_swap_agent,
//       swapAgent1155Address: info.bsc_erc_1155_swap_agent,
//     },
//   ];
// };

export const getChainData = (
  chainList: Array<ChainData>,
  chain: Chain
): ChainData => {
  return chainList.find((item) => item.value === chain)!;
};

export const getChainDataByChainId = (
  chainList: Array<ChainData>,
  chainId?: number
): ChainData => {
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

export const formatAddress = (address: string, showLength: number): string => {
  const length = address.length;
  return `${address.substring(0, showLength)}...${address.substring(
    length - showLength,
    length
  )}`;
};
