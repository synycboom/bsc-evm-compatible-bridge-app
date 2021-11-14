import { atom } from 'recoil';
import {
  DEFAULT_BRIDGE_ADDRESS_STATE,
  DEFAULT_STEP_DATA_STATE,
  EMPTY_NFT_DATA,
} from 'src/constants/nft';
import { INFTParsedTokenAccount } from 'src/interfaces/nft';

export const bridgeAddressState = atom({
  key: 'bridgeAddressState',
  default: DEFAULT_BRIDGE_ADDRESS_STATE,
});

export const nftState = atom<INFTParsedTokenAccount>({
  key: 'nftState',
  default: EMPTY_NFT_DATA,
});

export const stepDataState = atom({
  key: 'stepDataState',
  default: DEFAULT_STEP_DATA_STATE,
});
