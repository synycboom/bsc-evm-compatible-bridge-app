import { message } from 'antd';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { getInfo } from 'src/apis/info';
import { Chain, ChainData } from 'src/interfaces/nft';
import { chainListState, infoState } from 'src/state/info';

export const useChainList = () => {
  const [info, setInfo] = useRecoilState(infoState);
  const [chainList, setChainList] = useRecoilState(chainListState);

  useEffect(() => {
    if (!info) {
      getInfo().then((data) => {
        setInfo(data);
        setChainList([
          {
            id: data.eth_chain_id,
            name: 'Ethereum',
            value: Chain.ETHEREUM,
            registerFee: 0.001,
            transferFee: 0.002,
            currency: 'ETH',
            swapAgent721Address: data.eth_erc_721_swap_agent,
            swapAgent1155Address: data.eth_erc_1155_swap_agent,
          },
          {
            id: data.bsc_chain_id,
            name: 'Binance Smart Chain',
            value: Chain.BSC,
            registerFee: 0.1,
            transferFee: 0.2,
            currency: 'BNB',
            swapAgent721Address: data.bsc_erc_721_swap_agent,
            swapAgent1155Address: data.bsc_erc_1155_swap_agent,
          },
          {
            id: data.polygon_chain_id,
            name: 'Polygon',
            value: Chain.POLYGON,
            registerFee: 0.1,
            transferFee: 0.2,
            currency: 'MATIC',
            swapAgent721Address: data.polygon_erc_721_swap_agent,
            swapAgent1155Address: data.polygon_erc_1155_swap_agent,
          },
          // {
          //   id: 43113,
          //   name: 'Avalanche',
          //   value: Chain.AVALANCHE,
          //   registerFee: 0.1,
          //   transferFee: 0.2,
          //   currency: 'AVAX',
          //   swapAgent721Address: data.bsc_erc_721_swap_agent,
          //   swapAgent1155Address: data.bsc_erc_1155_swap_agent,
          // },
          // {
          //   id: data.fantom_chain_id,
          //   name: 'Fantom',
          //   value: Chain.FANTOM,
          //   registerFee: 0.1,
          //   transferFee: 0.2,
          //   currency: 'FTM',
          //   swapAgent721Address: data.fantom_erc_721_swap_agent,
          //   swapAgent1155Address: data.fantom_erc_1155_swap_agent,
          // },
          // {
          //   id: 999,
          //   name: 'Wanchain',
          //   value: Chain.WANCHAIN,
          //   registerFee: 0.1,
          //   transferFee: 0.2,
          //   currency: 'WAN',
          //   swapAgent721Address: data.bsc_erc_721_swap_agent,
          //   swapAgent1155Address: data.bsc_erc_1155_swap_agent,
          // },
        ]);
      });
    }
  }, [info]);

  return chainList;
};

export const getChainDataByChainId = (
  chainList: Array<ChainData>,
  chainId?: number
): ChainData => {
  return chainList.find((item) => item.id === Number(chainId))!;
};

export const requestChangeNetwork = async (
  chainId: number
): Promise<boolean> => {
  const provider = window.ethereum;
  if (provider && provider.request) {
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
        message.error(`Please add chain id: ${chainId} chain to your network`);
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
