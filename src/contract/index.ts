import { ethers } from 'ethers';

export const getSigner = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum!);
  const signer = provider.getSigner(0);
  return signer;
};

export const getContract = (contractAddress: string, abi: any) => {
  const signer = getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  return contract;
};
