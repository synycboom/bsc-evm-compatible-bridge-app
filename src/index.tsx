import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

const POLLING_INTERVAL = 12000;

export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Web3ReactProvider getLibrary={getLibrary}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Web3ReactProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
