import axios from 'axios';
import { parseNFTData } from 'src/helpers/nft';
import { getChainDataByChainId } from 'src/helpers/wallet';
import { INFTParsedTokenAccount, NFTStandard } from 'src/interfaces/nft';
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
    const chainData = getChainDataByChainId(chainId);
    return parseNFTData(address, items, nftStandard, chainData.value!);
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
