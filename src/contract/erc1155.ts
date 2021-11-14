import { message } from 'antd';
import { ethers } from 'ethers';
import { getContract } from '.';
import erc1155Abi from './abi/erc1155';
import erc1155Agent from './abi/erc1155Agent';

class Contract1155 {
  async getApprove(
    tokenAddress: string,
    account: string,
    contractAddress: string
  ) {
    const contract = getContract(tokenAddress, erc1155Abi);
    const approvedContract = await contract.isApprovedForAll(
      account,
      contractAddress
    );
    return approvedContract;
  }

  async approve(contractAddress: string, tokenAddress: string) {
    return new Promise(async (reslove) => {
      const contract = getContract(tokenAddress, erc1155Abi);
      try {
        const response = await contract.setApprovalForAll(
          contractAddress,
          true
        );
        console.debug(response.hash);
        contract.on('ApprovalForAll', (account, operator, approved) => {
          console.debug(account, operator, approved);
          if (
            operator.toLowerCase() === contractAddress.toLowerCase() &&
            approved
          ) {
            contract.removeAllListeners('ApprovalForAll');
            reslove(true);
          }
        });
      } catch {
        contract.removeAllListeners('ApprovalForAll');
        reslove(false);
      }
    });
  }

  async getTokenUri(tokenAddress: string, tokenId: number | string) {
    const contract = getContract(tokenAddress, erc1155Abi);
    try {
      const tokenUri = await contract.uri(Number(tokenId));
      return tokenUri.replace(
        '{id}',
        Number(tokenId).toString(16).padStart(64, '0')
      );
    } catch {
      message.error('Cannot find token!');
      return null;
    }
  }

  async registerToken(
    agentAddress: string,
    tokenAddress: string,
    targetChainId: number,
    fee: number
  ): Promise<boolean> {
    return new Promise(async (reslove) => {
      const contract = getContract(agentAddress, erc1155Agent);
      try {
        const overrides = {
          value: ethers.utils.parseEther(fee.toString()),
        };
        const response = await contract.registerSwapPair(
          tokenAddress,
          targetChainId,
          overrides
        );
        console.info('tx: ', response.hash);
        contract.on(
          'SwapPairRegister',
          (sponsor, _tokenAddress, toChainId, feeAmount) => {
            console.debug(sponsor, _tokenAddress, toChainId, feeAmount);
            reslove(true);
            contract.removeAllListeners('SwapPairRegister');
          }
        );
      } catch (error) {
        console.debug(error);
        contract.removeAllListeners('SwapPairRegister');
        reslove(false);
      }
    });
  }

  async transferToken(
    agentAddress: string,
    tokenAddress: string,
    recipient: string,
    tokenId: number | string,
    amounts: number,
    targetChainId: number,
    fee: number
  ): Promise<string> {
    const contract = getContract(agentAddress, erc1155Agent);
    try {
      const overrides = {
        value: ethers.utils.parseEther(fee.toString()),
      };
      const response = await contract.swap(
        tokenAddress,
        recipient,
        [Number(tokenId)],
        [amounts],
        targetChainId,
        overrides
      );
      return response.hash;
    } catch (error: any) {
      console.debug(error);
      message.error(error.data.message);
      return '';
    }
  }
}

export default new Contract1155();
