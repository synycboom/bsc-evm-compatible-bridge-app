import styled from 'styled-components';
import AntdButton, { ButtonProps } from 'antd/lib/button';

const ButtonStyle = styled(AntdButton)`
  font-weight: bold;
  height: 40px;

  &.ant-btn-round {
    border-radius: 12px;
  }
`;

const Button = (allProps: ButtonProps) => {
  const { children, ...props } = allProps;
  return <ButtonStyle {...props}>{children}</ButtonStyle>;
};

export default Button;
