import erc721AgentAbi from './abi/erc721Agent';
import erc721Abi from './abi/erc721';
import { getContract } from '.';
import { message } from 'antd';

class Contract721 {
  async getApprove(
    contractAddress: string,
    tokenAddress: string,
    tokenId: number | string
  ) {
    const contract = getContract(tokenAddress, erc721Abi);
    const approvedContract = await contract.getApproved(Number(tokenId));
    console.log(approvedContract, contractAddress);
    return approvedContract === contractAddress;
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
        console.log(response.hash);
        contract.on('Approval', (owner, approved, _tokenId) => {
          if (
            approved === contractAddress &&
            Number(tokenId) === _tokenId.toNumber()
          ) {
            contract.removeAllListeners('Approval');
            reslove(true);
          }
          console.log(owner, approved, _tokenId);
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
    targetChainId: number
  ): Promise<boolean> {
    return new Promise(async (reslove) => {
      const contract = getContract(agentAddress, erc721AgentAbi);
      try {
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
            console.log('SwapPairRegister');
            console.log(
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
        const response = await contract.registerSwapPair(
          tokenAddress,
          targetChainId
        );
        console.log('tx: ', response.hash);
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
    targetChainId: number
  ): Promise<boolean> {
    const contract = getContract(agentAddress, erc721AgentAbi);
    console.log(tokenAddress, recipient, Number(tokenId), targetChainId);
    try {
      const response = await contract.swap(
        tokenAddress,
        recipient,
        Number(tokenId),
        targetChainId
      );
      console.log('tx: ', response.hash);
      return true;
    } catch {
      return false;
    }
  }
}

export default new Contract721();
