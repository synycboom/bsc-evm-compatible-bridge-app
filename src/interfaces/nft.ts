export enum Chain {
  BSC = 'bsc',
  ETHEREUM = 'ethereum',
}

export enum NFTStandard {
  ERC_721 = 'erc721',
  ERC_1155 = 'erc1155',
}

export const NFT_STANDARD_OPTIONS = [
  {
    label: 'ERC-721',
    value: NFTStandard.ERC_721,
  },
  {
    label: 'ERC-1155',
    value: NFTStandard.ERC_1155,
  },
];

export interface INFTParsedTokenAccount {
  tokenId?: string;
  uri?: string;
  animation_url?: string | null;
  external_url?: string | null;
  image?: string;
  image_256?: string;
  nftName?: string;
  description?: string;
  walletAddress: string;
  contractAddress: string;
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
  symbol?: string;
  name?: string;
  logo?: string;
  isNativeAsset?: boolean;
  standard: NFTStandard;
  chain: Chain;
}
export type CovalentNFTExternalData = {
  animation_url: string | null;
  external_url: string | null;
  image: string;
  image_256: string;
  name: string;
  description: string;
};
export type CovalentNFTData = {
  token_id: string;
  token_balance: string;
  external_data: CovalentNFTExternalData;
  token_url: string;
};
export type CovalentData = {
  contract_decimals: number;
  contract_ticker_symbol: string;
  contract_name: string;
  contract_address: string;
  logo_url: string | undefined;
  balance: string;
  quote: number | undefined;
  quote_rate: number | undefined;
  nft_data?: CovalentNFTData[];
};

export type NFTStandardData = {
  label: string;
  value: NFTStandard;
};

export type ChainData = {
  id: number;
  name: string;
  value: Chain;
};
