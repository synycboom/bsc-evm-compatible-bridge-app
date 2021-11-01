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
  const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${setting.REACT_APP_COVALENT_API_KEY}&nft=true`;
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
  contractAddress: string
): Promise<boolean> => {
  return false;
};
