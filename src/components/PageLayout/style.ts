import styled from 'styled-components';

const LayoutStyle = styled.div`
  .app-name {
    cursor: pointer;
  }

  .ant-layout {
    background: unset;
  }
  .ant-page-header {
    padding: 16px;
  }

  .ant-page-header-heading-sub-title {
    font-weight: bold;
  }
  .ant-layout-content {
    padding: 16px;
    background: unset;
    display: flex;
    justify-content: center;

    .container {
      max-width: 1024px;
      width: 100%;
      padding-top: 24px;
    }
  }
  .ant-layout-footer {
    padding: 16px;
    background: unset;
  }

  .ant-page-header-heading-extra {
    margin-left: 48px;
    .ant-btn-link {
      margin: 0px 8px;
      font-size: 16px;
      font-weight: bold;
    }
  }
`;
export default LayoutStyle;
