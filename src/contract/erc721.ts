import erc721AgentAbi from './abi/erc721Agent';
import erc721Abi from './abi/erc721';
import { getContract } from '.';
import { message } from 'antd';
import { ethers } from 'ethers';

class Contract721 {
  async getApprove(
    contractAddress: string,
    tokenAddress: string,
    tokenId: number | string
  ) {
    const contract = getContract(tokenAddress, erc721Abi);
    const approvedContract = await contract.getApproved(Number(tokenId));
    return approvedContract.toLowerCase() === contractAddress.toLowerCase();
  }

  async approve(
    contractAddress: string,
    tokenAddress: string,
    tokenId: number | string
  ) {
    return new Promise(async (reslove) => {
      const contract = getContract(tokenAddress, erc721Abi);
      try {
        const response = await contract.approve(
          contractAddress,
          Number(tokenId)
        );
        console.info(response.hash);
        contract.on('Approval', (owner, approved, _tokenId) => {
          if (
            approved.toLowerCase() === contractAddress.toLowerCase() &&
            Number(tokenId) === _tokenId.toNumber()
          ) {
            contract.removeAllListeners('Approval');
            reslove(true);
          }
        });
      } catch {
        contract.removeAllListeners('Approval');
        reslove(false);
      }
    });
  }

  async getTokenUri(tokenAddress: string, tokenId: number | string) {
    const contract = getContract(tokenAddress, erc721Abi);
    try {
      const tokenUri = await contract.tokenURI(Number(tokenId));
      return tokenUri;
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
      const contract = getContract(agentAddress, erc721AgentAbi);
      try {
        const overrides = {
          value: ethers.utils.parseEther(fee.toString()),
        };
        const response = await contract.registerSwapPair(
          tokenAddress,
          targetChainId,
          overrides
        );
        contract.on(
          'SwapPairRegister',
          (
            sponsor,
            _tokenAddress,
            tokenName,
            tokenSymbol,
            toChainId,
            feeAmount
          ) => {
            console.info(
              sponsor,
              _tokenAddress,
              tokenName,
              tokenSymbol,
              toChainId,
              feeAmount
            );
            reslove(true);
            contract.removeAllListeners('SwapPairRegister');
          }
        );
        console.info('tx: ', response.hash);
      } catch {
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
    targetChainId: number,
    fee: number
  ): Promise<string> {
    const contract = getContract(agentAddress, erc721AgentAbi);
    try {
      const overrides = {
        value: ethers.utils.parseEther(fee.toString()),
      };
      const response = await contract.swap(
        tokenAddress,
        recipient,
        Number(tokenId),
        targetChainId,
        overrides
      );
      console.debug('tx: ', response.hash);
      return response.hash;
    } catch (error) {
      console.error(error);
      return '';
    }
  }
}

export default new Contract721();
