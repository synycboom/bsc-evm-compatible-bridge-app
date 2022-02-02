import styled from 'styled-components';

const MyNFTPageStyle = styled.div`
  .header {
    text-align: center;
    margin-bottom: 24px;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
  }

  .reload-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }

  .no-data-container {
    display: flex;
    justify-content: center;
    height: 100%;
    padding-top: 40px;
    align-items: center;
  }

  .ant-card {
    border-radius: 8px;
    width: 250px;
  }
  .ant-card-cover {
    border-radius: 8px;
  }
`;

export default MyNFTPageStyle;
