import { ChainData, InfoData } from 'src/interfaces/nft';
import { atom } from 'recoil';

export const infoState = atom<InfoData | null>({
  key: 'infoState',
  default: null,
});

export const chainListState = atom<ChainData[]>({
  key: 'chainListState',
  default: [],
});
