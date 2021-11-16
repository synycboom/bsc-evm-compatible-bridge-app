import axios from 'axios';
import { serializeQueryString } from 'src/helpers';
import { parseNFTData } from 'src/helpers/nft';
import {
  Erc721Swap,
  ERROR_STATE,
  INFTParsedTokenAccount,
  NFTStandard,
  SwapState,
  TransferData,
  TransferStatus,
} from 'src/interfaces/nft';
import setting from 'src/setting';

export type INFTList = Array<{
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[];
  logo_url: string;
  last_transferred_at: string;
  type: 'cryptocurrency' | 'nft';
  balance: string;
  balance_24h: any;
  quote_rate: number;
  quote_rate_24h: number;
  quote: number;
  quote_24h: any;
  nft_data: any;
}>;

export const getNFTList = async (
  chainId: number,
  address: string,
  nftStandard: NFTStandard
): Promise<INFTParsedTokenAccount[]> => {
  const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${setting.COVALENT_API_KEY}&nft=true`;
  const response = await axios.get<{
    data: {
      items: INFTList;
    };
  }>(url);
  if (response.status === 200) {
    const items = response.data.data.items.filter(
      (item) =>
        item.type === 'nft' &&
        item.nft_data &&
        item.supports_erc?.includes(nftStandard)
    );
    return parseNFTData(address, items, nftStandard, chainId);
  }
  return [];
};

export const getIsNftRegistered = async (
  chainId: number,
  targetChainId: number,
  tokenAddress: string
): Promise<boolean> => {
  const forwardUrl = `${setting.API_URL}/v1/erc-721-swap-pairs?available=true&src_chain_id=${chainId}&dst_chain_id=${targetChainId}&src_token_addr=${tokenAddress}&limit=1`;
  const backwardUrl = `${setting.API_URL}/v1/erc-721-swap-pairs?available=true&dst_chain_id=${chainId}&src_chain_id=${targetChainId}&dst_token_addr=${tokenAddress}&limit=1`;
  const forwardResponse = await axios.get<{ pairs: [] }>(forwardUrl);
  const backwardResponse = await axios.get<{ pairs: [] }>(backwardUrl);
  return (
    forwardResponse.data.pairs.length > 0 ||
    backwardResponse.data.pairs.length > 0
  );
};

export const getIsNft1155Registered = async (
  chainId: number,
  targetChainId: number,
  tokenAddress: string
): Promise<boolean> => {
  const forwardUrl = `${setting.API_URL}/v1/erc-1155-swap-pairs?available=true&src_chain_id=${chainId}&dst_chain_id=${targetChainId}&src_token_addr=${tokenAddress}&limit=1`;
  const backwardUrl = `${setting.API_URL}/v1/erc-1155-swap-pairs?available=true&dst_chain_id=${chainId}&src_chain_id=${targetChainId}&dst_token_addr=${tokenAddress}&limit=1`;
  const forwardResponse = await axios.get<{ pairs: [] }>(forwardUrl);
  const backwardResponse = await axios.get<{ pairs: [] }>(backwardUrl);
  return (
    forwardResponse.data.pairs.length > 0 ||
    backwardResponse.data.pairs.length > 0
  );
};

export const getDataFromTokenUri = async (
  tokenUri: string
): Promise<{
  name: string;
  image: string;
  description: string;
}> => {
  try {
    const response = await axios.get<{
      data: {
        name: string;
        image: string;
        description: string;
      };
    }>(tokenUri);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error(error.response);
    return {
      name: '',
      image: '',
      description: '',
    };
  }
};

export const get721TransferData = async (
  sender: string,
  txHash: string
): Promise<TransferData> => {
  const url = `${setting.API_URL}/v1/erc-721-swaps?limit=1&sender=${sender}&request_tx_hash=${txHash}`;
  const data = {
    status: TransferStatus.InProgress,
    dstTokenAddress: '',
    dstTokenId: '',
  };
  try {
    const response = await axios.get<{ erc_721_swaps: Array<Erc721Swap> }>(url);
    const transactionData = response.data.erc_721_swaps[0];

    if (!transactionData) {
      return data;
    }
    const { state, dst_token_addr, token_id } = transactionData;

    if (state === SwapState.FillTxConfirmed) {
      data.status = TransferStatus.Done;
      data.dstTokenAddress = dst_token_addr;
      data.dstTokenId = token_id;
    } else if (ERROR_STATE.includes(state)) {
      data.status = TransferStatus.Error;
    } else {
      data.status = TransferStatus.InProgress;
    }
  } catch (error) {
    console.error(error);
    data.status = TransferStatus.Error;
  }
  return data;
};

export const get1155TransferStatus = async (
  sender: string,
  txHash: string
): Promise<TransferData> => {
  const url = `${setting.API_URL}/v1/erc-1155-swaps?limit=1&sender=${sender}&request_tx_hash=${txHash}`;
  const data = {
    status: TransferStatus.InProgress,
    dstTokenAddress: '',
    dstTokenId: '',
  };
  try {
    const response = await axios.get<{ erc_1155_swaps: Array<any> }>(url);
    const transactionData = response.data.erc_1155_swaps[0];
    if (!transactionData) {
      return data;
    }

    const { state, dst_token_addr, token_id } = transactionData;

    if (state === SwapState.FillTxConfirmed) {
      data.status = TransferStatus.Done;
      data.dstTokenAddress = dst_token_addr;
      data.dstTokenId = token_id;
    } else if (ERROR_STATE.includes(state)) {
      data.status = TransferStatus.Error;
    } else {
      data.status = TransferStatus.InProgress;
    }
  } catch (error) {
    console.error(error);
    data.status = TransferStatus.Error;
  }
  return data;
};

export const getTransferStatusList = async (
  sender: string,
  query: Record<string, string> = {}
) => {
  const url721 = `${
    setting.API_URL
  }/v1/erc-721-swaps?sender=${sender}&${serializeQueryString(query)}`;
  const response721 = await axios.get<{ erc_721_swaps: Array<any> }>(url721);
  const url1155 = `${
    setting.API_URL
  }/v1/erc-1155-swaps?sender=${sender}&${serializeQueryString(query)}`;
  const response1155 = await axios.get<{ erc_1155_swaps: Array<any> }>(url1155);
  return {
    list721: response721.data.erc_721_swaps,
    list1155: response1155.data.erc_1155_swaps,
  };
};
