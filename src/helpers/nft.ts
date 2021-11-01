import { formatUnits } from 'ethers/lib/utils';
import {
  Chain,
  CovalentData,
  INFTParsedTokenAccount,
  NFTStandard,
  NFTStandardData,
  NFT_STANDARD_OPTIONS,
} from 'src/interfaces/nft';

export const parseNFTData = (
  walletAddress: string,
  tokenList: CovalentData[],
  standard: NFTStandard,
  chain: Chain
): INFTParsedTokenAccount[] => {
  return tokenList.reduce((arr, covalent) => {
    if (covalent.nft_data) {
      covalent.nft_data.forEach((data) =>
        arr.push({
          walletAddress,
          contractAddress: covalent.contract_address,
          amount: data.token_balance,
          decimals: covalent.contract_decimals,
          uiAmount: Number(
            formatUnits(data.token_balance, covalent.contract_decimals)
          ),
          uiAmountString: formatUnits(
            data.token_balance,
            covalent.contract_decimals
          ),
          symbol: covalent.contract_ticker_symbol,
          name: covalent.contract_name,
          logo: covalent.logo_url,
          tokenId: data.token_id,
          uri: data.token_url,
          animation_url: data.external_data.animation_url,
          external_url: data.external_data.external_url,
          image: data.external_data.image,
          image_256: data.external_data.image_256,
          nftName: data.external_data.name,
          description: data.external_data.description,
          standard,
          chain,
        })
      );
    }
    return arr;
  }, [] as INFTParsedTokenAccount[]);
};

export const getNFTStandard = (standard: NFTStandard): NFTStandardData => {
  return NFT_STANDARD_OPTIONS.find((item) => item.value === standard)!;
};
