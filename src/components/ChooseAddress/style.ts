import styled from 'styled-components';

const ChooseAddressStyle = styled.div`
  .box {
    background-color: white;
    padding: 24px;
    margin: 16px 0px;

    border-radius: 1em;
    box-shadow: 2px 2px 8px 2px #e1e1e1;
  }

  .address-detail {
    color: black;
    .address {
      text-decoration: underline;
      font-weight: bold;
    }
  }

  .arrow-container {
    display: flex;
    align-items: center;
    font-size: 32px;
  }

  .next-container {
    margin-top: 32px;
    display: flex;
    justify-content: right;

    .ant-btn {
      width: 120px;
    }
  }
`;
export default ChooseAddressStyle;
