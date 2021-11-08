import { message } from 'antd';
import { getContract } from '.';
import erc1155Abi from './abi/erc1155';

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
    console.log({ approvedContract });
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
        console.log(response.hash);
        contract.on('ApprovalForAll', (account, operator, approved) => {
          console.log(account, operator, approved);
          if (
            operator.toLowerCase() === contractAddress.toLowerCase() &&
            approved
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
    targetChainId: number
  ): Promise<boolean> {
    return new Promise(async (reslove) => {
      const contract = getContract(agentAddress, erc1155Abi);
      try {
        contract.on(
          'SwapPairRegister',
          (sponsor, _tokenAddress, toChainId, feeAmount) => {
            console.log(sponsor, _tokenAddress, toChainId, feeAmount);
            reslove(true);
            contract.removeAllListeners('SwapPairRegister');
          }
        );
        const response = await contract.registerSwapPair(
          tokenAddress,
          targetChainId
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
    amounts: number,
    targetChainId: number
  ): Promise<string> {
    const contract = getContract(agentAddress, erc1155Abi);
    try {
      const response = await contract.swap(
        tokenAddress,
        recipient,
        [Number(tokenId)],
        [amounts],
        targetChainId
      );
      return response.hash;
    } catch (error) {
      console.log(error);
      return '';
    }
  }
}

export default new Contract1155();
