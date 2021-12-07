import { atom } from 'recoil';

export const DEFAULT_PROFILE = {
  walletAddress: '',
  email: '',
  ud: '',
};

export const profileState = atom({
  key: 'profileState',
  default: DEFAULT_PROFILE,
});
