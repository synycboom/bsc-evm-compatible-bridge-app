import {
  Chain,
  INFTParsedTokenAccount,
  NFTStandard,
  TransferStatus,
} from 'src/interfaces/nft';

export const EMPTY_NFT_DATA: INFTParsedTokenAccount = {
  tokenId: '',
  uri: '',
  animation_url: '',
  external_url: '',
  image: '',
  image_256: '',
  nftName: '',
  description: '',
  walletAddress: '',
  contractAddress: '',
  amount: '',
  decimals: 0,
  uiAmount: 0,
  uiAmountString: '',
  name: '',
  standard: NFTStandard.ERC_721,
  chain: Chain.ETHEREUM,
  chainId: 0,
};

export const DEFAULT_STEP_DATA_STATE = {
  step: 0,
  transferStatus: TransferStatus.NotStart,
};

export const DEFAULT_BRIDGE_ADDRESS_STATE = {
  sourceAddress: '',
  sourceChain: undefined,
  targetAddress: '',
  targetChain: undefined,
};
