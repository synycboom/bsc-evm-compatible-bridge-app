import styled from 'styled-components';

const BridgePageStyle = styled.div`
  .header {
    text-align: center;
    margin-bottom: 24px;
  }

  .box {
    background-color: white;
    padding: 24px;
    margin: 16px 0px;

    border-radius: 1em;
    box-shadow: 2px 2px 8px 2px #e1e1e1;
  }

  .ant-steps-item-title {
    font-weight: bold;
  }

  .ant-select {
    width: 100%;

    .ant-select-selector {
      height: 50px;
      display: flex;
      align-items: center;
      font-weight: bold;
    }
  }

  .ant-space {
    width: 100%;
  }

  .ant-input {
    height: 40px;
  }
  .ant-btn {
    font-weight: bold;
    height: 40px;

    &.ant-btn-round {
      border-radius: 16px;
    }

    &.blue {
      background: #3fafac;
      border-color: #3fafac;
    }
  }

  .ant-steps-item-content {
    padding: 0px 8px;
  }
`;
export default BridgePageStyle;
