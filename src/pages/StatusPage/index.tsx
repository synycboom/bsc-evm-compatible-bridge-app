import Table from 'antd/lib/table';
import Title from 'antd/lib/typography/Title';
import { useEffect, useState } from 'react';
import { getTransferStatusList } from 'src/apis/nft';
import PageLayout from 'src/components/PageLayout';
import { getChainDataByChainId, useChainList } from 'src/helpers/wallet';
import dayjs from 'dayjs';
import { getNFTStatusFromState } from 'src/helpers/nft';
import TransferStatusLabel from 'src/components/TransferStatusLabel';

import StatusPageStyle from './style';
import { SwapState } from 'src/interfaces/nft';
import TextAddress from 'src/components/TextAddress';
import { profileState } from 'src/state/profile';
import { useRecoilValue } from 'recoil';

const StatusPage: React.FC = () => {
  const chainList = useChainList();
  const { walletAddress } = useRecoilValue(profileState);
  const [data721, setData721] = useState([]);
  const [data1155, setData1155] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns721 = [
    {
      title: 'Sender',
      dataIndex: 'sender',
      key: 'sender',
      render: (text: string, record: any) => (
        <>
          <TextAddress address={text} length={4} />
          <br />({getChainDataByChainId(chainList, record.src_chain_id)?.name})
        </>
      ),
    },
    {
      title: 'Recipient',
      dataIndex: 'recipient',
      key: 'recipient',
      render: (text: string, record: any) => (
        <>
          <TextAddress address={text} length={4} />
          <br />({getChainDataByChainId(chainList, record.dst_chain_id)?.name})
        </>
      ),
    },
    {
      title: 'Source Token Address',
      dataIndex: 'src_token_addr',
      key: 'src_token_addr',
      render: (text: string) => (
        <TextAddress address={text} length={4} copyable />
      ),
    },
    {
      title: 'Destination Token Address',
      dataIndex: 'dst_token_addr',
      key: 'dst_token_addr',
      render: (text: string) => (
        <TextAddress address={text} length={4} copyable />
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

  const columns1155 = [
    {
      title: 'Sender',
      dataIndex: 'sender',
      key: 'sender',
      render: (text: string, record: any) => (
        <>
          <TextAddress address={text} length={4} />
          <br />({getChainDataByChainId(chainList, record.src_chain_id)?.name})
        </>
      ),
    },
    {
      title: 'Recipient',
      dataIndex: 'recipient',
      key: 'recipient',
      render: (text: string, record: any) => (
        <>
          <TextAddress address={text} length={4} />
          <br />({getChainDataByChainId(chainList, record.dst_chain_id)?.name})
        </>
      ),
    },
    {
      title: 'Source Token Address',
      dataIndex: 'src_token_addr',
      key: 'src_token_addr',
      render: (text: string) => (
        <TextAddress address={text} length={4} copyable />
      ),
    },
    {
      title: 'Destination Token Address',
      dataIndex: 'dst_token_addr',
      key: 'dst_token_addr',
      render: (text: string) => (
        <TextAddress address={text} length={4} copyable />
      ),
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

  useEffect(() => {
    if (walletAddress) {
      setLoading(true);
      const interval = setInterval(() => {
        getTransferStatusList(walletAddress).then(
          ({ list721, list1155 }: any) => {
            setData721(list721);
            setData1155(list1155);
            setLoading(false);
          }
        );
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setData721([]);
      setData1155([]);
    }
  }, [walletAddress]);

  return (
    <StatusPageStyle>
      <PageLayout>
        <div className='header'>
          <Title level={2}>NFT Bridge Status</Title>
        </div>
        <Title level={4}>ERC-721</Title>
        <Table
          loading={loading}
          pagination={false}
          columns={columns721}
          dataSource={data721}
        />
        <br />
        <br />
        <Title level={4}>ERC-1155</Title>
        <Table
          loading={loading}
          pagination={false}
          columns={columns1155}
          dataSource={data1155}
        />
      </PageLayout>
    </StatusPageStyle>
  );
};

export default StatusPage;
