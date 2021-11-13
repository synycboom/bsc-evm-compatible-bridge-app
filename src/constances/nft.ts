import { Chain, INFTParsedTokenAccount, NFTStandard } from 'src/interfaces/nft';

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
