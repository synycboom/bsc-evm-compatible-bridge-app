import Modal from 'antd/lib/modal';
import styled from 'styled-components';

const ChooseNFTModalStyle = styled(Modal)`
  .search-container {
    display: flex;
    justify-content: space-between;
  }

  .manual-button {
    padding: 0px;
    span {
      text-decoration: underline;
    }
  }

  .manual-container {
    p {
      font-weight: bold;
    }
  }

  .no-data-container {
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: center;
  }

  .ant-modal-content {
    border-radius: 16px;
    width: 600px;
  }
  .ant-modal-header {
    border-radius: 16px 16px 0px 0px;
  }

  .ant-card {
    border-radius: 8px;
    width: 170px;
  }
  .ant-card-cover {
    border-radius: 8px;
  }

  .ant-card-body {
    padding: 8px;

    p,
    .ant-typography {
      margin: 0px;
    }
  }

  .ant-modal-body {
    .image-container {
      height: 400px;
      overflow: scroll;
    }
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 72px;

    .anticon-loading {
      font-size: 48px;
    }
    .ant-typography {
      margin-top: 16px;
    }
  }

  .ant-card-bordered {
    border: 1px solid #e7e7e7;
  }

  .ant-modal-footer {
    display: none;
    border-top: none;
  }

  .ant-radio-group {
    font-weight: bold;
    &.ant-radio-group-solid
      .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
      background: #3fafac;
      font-family: monospace;
      border-color: #3fafac;
      &:hover {
        background: #2c9794;
        border-color: #2c9794;
        color: white;
      }
    }
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
      background: #3fafac;
    }
    .ant-radio-button-wrapper:hover {
      color: #2c9794;
    }
    .ant-radio-button-wrapper:first-child {
      border-radius: 10px 0px 0px 10px;
    }
    .ant-radio-button-wrapper:last-child {
      border-radius: 0px 10px 10px 0px;
    }
  }

  .token-amount-container {
    margin-top: 16px;

    span {
      font-weight: bold;
    }
    .token-amount-input {
      width: 200px;
      margin-left: 8px;
    }
  }
`;
export default ChooseNFTModalStyle;
