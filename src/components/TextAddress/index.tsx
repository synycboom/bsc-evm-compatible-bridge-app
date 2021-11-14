import Tooltip from 'antd/lib/tooltip';
import { formatAddress } from 'src/helpers/wallet';
import Paragraph from 'antd/lib/typography/Paragraph';
import styled from 'styled-components';

const AddressTooltip = ({ text, children }: any) => {
  return (
    <Tooltip
      title={text}
      overlayInnerStyle={{
        width: 350,
        borderRadius: 8,
      }}
    >
      {children}
    </Tooltip>
  );
};

type TextAddressProps = {
  copyable?: boolean;
  hoverable?: boolean;
  address: string;
  length?: number;
};

const Style = styled.div`
  display: inline;
  .ant-typography {
    display: inline;
  }
  .ant-typography-copy {
    color: #3fafac;
  }
`;

const TextAddress = ({
  copyable = false,
  address,
  length,
}: TextAddressProps) => (
  <AddressTooltip text={length ? address : ''}>
    <Style>
      <Paragraph
        copyable={copyable ? { text: address, tooltips: false } : false}
        style={{ display: 'inline' }}
      >
        {length ? formatAddress(address, length) : address}
      </Paragraph>
    </Style>
  </AddressTooltip>
);

export default TextAddress;
