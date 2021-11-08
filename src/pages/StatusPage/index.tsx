import Table from 'antd/lib/table';
import Title from 'antd/lib/typography/Title';
import Tooltip from 'antd/lib/tooltip';
import { useEffect, useState } from 'react';
import { getTransferStatusList } from 'src/apis/nft';
import PageLayout from 'src/components/PageLayout';
import { formatAddress, getChainDataByChainId } from 'src/helpers/wallet';
import dayjs from 'dayjs';
import { getNFTStatusFromState, SwapState } from 'src/helpers/nft';
import TransferStatusLabel from 'src/components/TransferStatusLabel';
import { useWeb3React } from '@web3-react/core';
import ConnectWalletButton from 'src/components/ConnectWalletButton';

import StatusPageStyle from './style';

const AddressTooltip = ({ text, children }: any) => {
  return (
    <Tooltip
      title={text}
      trigger={['hover']}
      overlayInnerStyle={{
        width: 350,
        borderRadius: 8,
      }}
    >
      {children}
    </Tooltip>
  );
};

const columns = [
  {
    title: 'Sender',
    dataIndex: 'sender',
    key: 'sender',
    render: (text: string, record: any) => (
      <AddressTooltip text={text}>
        {formatAddress(text, 6)}
        <br />({getChainDataByChainId(record.src_chain_id)?.name})
      </AddressTooltip>
    ),
  },
  {
    title: 'Recipient',
    dataIndex: 'recipient',
    key: 'recipient',
    render: (text: string, record: any) => (
      <AddressTooltip text={text}>
        {formatAddress(text, 6)}
        <br />({getChainDataByChainId(record.dst_chain_id)?.name})
      </AddressTooltip>
    ),
  },
  {
    title: 'Token Address',
    dataIndex: 'src_token_addr',
    key: 'src_token_addr',
    render: (text: string) => (
      <AddressTooltip text={text}>{formatAddress(text, 6)}</AddressTooltip>
    ),
  },
  {
    title: 'Token ID',
    dataIndex: 'token_id',
    key: 'token_id',
  },
  {
    title: 'Transfer at',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text: string) => (
      <span>{dayjs(text).format('DD/MM/YYYY HH:mm:ss')}</span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'state',
    key: 'state',
    render: (state: SwapState) => (
      <TransferStatusLabel status={getNFTStatusFromState(state)} />
    ),
  },
];

const StatusPage: React.FC = () => {
  const { account } = useWeb3React();

  const [data, setData] = useState([]);

  useEffect(() => {
    if (account) {
      getTransferStatusList(account).then((items: any) => setData(items));
    } else {
      setData([]);
    }
  }, [account]);

  return (
    <StatusPageStyle>
      <PageLayout>
        <div className='header'>
          <Title level={2}>NFT Bridge Status</Title>
        </div>
        <div className='connect-wallet-container'>
          <ConnectWalletButton />
        </div>
        <Table pagination={false} columns={columns} dataSource={data} />
      </PageLayout>
    </StatusPageStyle>
  );
};

export default StatusPage;
