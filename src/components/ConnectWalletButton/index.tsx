import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';
import Button from 'src/components/Button';
import { formatAddress } from 'src/helpers/wallet';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 1000, 2000],
});

const ConnectWalletButton = ({ block }: any) => {
  const { account, activate, deactivate } = useWeb3React();

  const connect = async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.error(ex);
    }
  };

  const disconnect = async () => {
    try {
      deactivate();
    } catch (ex) {
      console.error(ex);
    }
  };
  return (
    <Button
      type='primary'
      className='blue'
      block={block}
      shape='round'
      onClick={account ? disconnect : connect}
    >
      {account ? `disconnect ${formatAddress(account, 5)}` : 'Connect Wallet'}
    </Button>
  );
};

export default ConnectWalletButton;
