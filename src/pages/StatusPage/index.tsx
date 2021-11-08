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
    title: 'Amounts',
    dataIndex: 'amounts',
    key: 'amounts',
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

  const [data721, setData721] = useState([]);
  const [data1155, setData1155] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setLoading(true);
      const interval = setInterval(() => {
        getTransferStatusList(account).then(({ list721, list1155 }: any) => {
          setData721(list721);
          setData1155(list1155);
          setLoading(false);
        });
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setData721([]);
      setData1155([]);
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
        <Title level={4}>ERC-721</Title>
        <Table
          loading={loading}
          pagination={false}
          columns={columns}
          dataSource={data721}
        />
        <br />
        <br />
        <Title level={4}>ERC-1155</Title>
        <Table
          loading={loading}
          pagination={false}
          columns={columns}
          dataSource={data1155}
        />
      </PageLayout>
    </StatusPageStyle>
  );
};

export default StatusPage;
