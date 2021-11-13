import { atom } from 'recoil';
import { EMPTY_NFT_DATA } from 'src/constances/nft';
import { INFTParsedTokenAccount, TransferStatus } from 'src/interfaces/nft';

export const bridgeAddressState = atom({
  key: 'bridgeAddressState',
  default: {
    sourceAddress: '',
    sourceChain: undefined,
    targetAddress: '',
    targetChain: undefined,
  },
});

export const nftState = atom<INFTParsedTokenAccount>({
  key: 'nftState',
  default: EMPTY_NFT_DATA,
});

export const stepDataState = atom({
  key: 'stepDataState',
  default: {
    step: 0,
    transferStatus: TransferStatus.NotStart,
  },
});
