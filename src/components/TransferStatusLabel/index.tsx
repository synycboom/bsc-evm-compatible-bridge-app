import SyncOutlined from '@ant-design/icons/SyncOutlined';
// import CheckCircleTwoTone from '@ant-design/icons/CheckCircleTwoTone';
// import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Tag from 'antd/lib/tag';
import styled from 'styled-components';
import { TransferStatus } from 'src/interfaces/nft';

const Style = styled.div`
  display: flex;
  align-items: center;

  .transfer-status {
    display: flex;
    margin-right: 8px;
    .anticon {
      font-size: 18px;
    }
  }
  .anticon-close-circle {
    color: #e70000;
  }
`;

const TransferStatusLabel: any = ({ status }: any) => {
  return (
    <Style>
      {status === TransferStatus.InProgress && (
        <>
          <Tag color='#2db7f5'>In Progress</Tag>
          <div className='transfer-status'>
            <SyncOutlined spin />
          </div>
        </>
      )}
      {status === TransferStatus.Done && (
        <>
          <Tag color='#4ac715'>Transfer success</Tag>
          {/* <div className='transfer-status'>
            <CheckCircleTwoTone twoToneColor='#4ac715' />
          </div> */}
        </>
      )}
      {status === TransferStatus.Error && (
        <>
          <Tag color='#e70000'>Transfer Error</Tag>
          {/* <div className='transfer-status'>
            <CloseCircleOutlined color='red' />
          </div> */}
        </>
      )}
    </Style>
  );
};

export default TransferStatusLabel;
