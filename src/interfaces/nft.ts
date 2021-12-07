export enum Chain {
  BSC = 'bsc',
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  // AVALANCHE = 'avalanche',
  // FANTOM = 'fantom',
  // WANCHAIN = 'wanchain',
}

export enum NFTStandard {
  ERC_721 = 'erc721',
  ERC_1155 = 'erc1155',
}

export enum TransferStatus {
  NotStart = 'not_start',
  InProgress = 'in_progress',
  Done = 'done',
  Error = 'error',
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
  chain?: Chain;
  chainId: number;
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
  registerFee: number;
  transferFee: number;
  currency: string;
  swapAgent721Address: string;
  swapAgent1155Address: string;
};

export type InfoData = {
  bsc_erc_1155_swap_agent: string;
  bsc_erc_721_swap_agent: string;
  eth_erc_1155_swap_agent: string;
  eth_erc_721_swap_agent: string;
  polygon_erc_721_swap_agent: string;
  polygon_erc_1155_swap_agent: string;
  fantom_erc_721_swap_agent: string;
  fantom_erc_1155_swap_agent: string;
  eth_chain_id: number;
  bsc_chain_id: number;
  polygon_chain_id: number;
  fantom_chain_id: number;
};

export interface TransferData {
  status: TransferStatus;
  dstTokenAddress: string;
  dstTokenId: string;
}

export enum SwapState {
  RequestOngoing = 'request_ongoing',
  RequestRejected = 'request_rejected',
  RequestConfirmed = 'request_confirmed',
  FillTxDryRunFailed = 'fill_tx_dry_run_failed',
  FillTxCreated = 'fill_tx_created',
  FillTxSent = 'fill_tx_sent',
  FillTxConfirmed = 'fill_tx_confirmed',
  FillTxFailed = 'fill_tx_failed',
  FillTxMissing = 'fill_tx_missing',
}

export const ERROR_STATE = [
  SwapState.FillTxFailed,
  SwapState.FillTxMissing,
  SwapState.RequestRejected,
  SwapState.FillTxDryRunFailed,
];

export interface Erc721Swap {
  base_uri: string;
  created_at: string;
  dst_chain_id: string;
  dst_token_addr: string;
  dst_token_name: string;
  fill_tx_hash: string;
  recipient: string;
  request_tx_hash: string;
  sender: string;
  src_chain_id: string;
  src_token_addr: string;
  src_token_name: string;
  state: SwapState;
  swap_direction: string;
  token_id: string;
  token_uri: string;
  updated_at: string;
}
