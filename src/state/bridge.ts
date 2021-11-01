import { atom } from 'recoil';
import { INFTParsedTokenAccount } from 'src/interfaces/nft';

export const bridgeAddressState = atom({
  key: 'bridgeAddressState',
  default: {
    sourceAddress: '',
    sourceChain: undefined,
    targetAddress: '',
    targetChain: undefined,
  },
});

export const nftState = atom<INFTParsedTokenAccount | null>({
  key: 'nftState',
  default: null,
});
