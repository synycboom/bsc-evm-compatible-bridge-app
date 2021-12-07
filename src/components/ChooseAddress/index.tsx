import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import Tooltip from 'antd/lib/tooltip';
import Title from 'antd/lib/typography/Title';
import Space from 'antd/lib/space';
import Button from 'src/components/Button';
import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import {
  getChainDataByChainId,
  requestChangeNetwork,
  useChainList,
} from 'src/helpers/wallet';
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import { bridgeAddressState } from 'src/state/bridge';
import { useRecoilState } from 'recoil';

import ChooseAddressStyle from './style';
import { message } from 'antd';
import Web3ConnectButton from '../ConnectWalletButton/web3';

const { Option } = Select;

type ChooseAccountPropType = {
  active: boolean;
  next: () => void;
};

const ChooseAccount: React.FC<ChooseAccountPropType> = ({ active, next }) => {
  const chainList = useChainList();
  const [bridgeAddress, setBridgeAddress] = useRecoilState(bridgeAddressState);
  const { account, chainId } = useWeb3React();

  const validate = (): boolean => {
    if (
      !bridgeAddress.targetChain ||
      !bridgeAddress.targetAddress ||
      !bridgeAddress.sourceChain ||
      !bridgeAddress.sourceAddress
    ) {
      message.error('Please choose address and chain!');
      return false;
    }

    if (chainId !== bridgeAddress.sourceChain) {
      const chain = getChainDataByChainId(chainList, bridgeAddress.sourceChain);
      message.error(`Please switch chain to ${chain.name}`);
      return false;
    }
    return true;
  };

  const validateAndNext = () => {
    if (validate()) {
      next();
    }
  };

  useEffect(() => {
    if (bridgeAddress.sourceChain) {
      requestChangeNetwork(bridgeAddress.sourceChain);
    }
  }, [chainId, bridgeAddress.sourceChain]);

  useEffect(() => {
    if (account) {
      setBridgeAddress({
        ...bridgeAddress,
        sourceAddress: account || '',
      });
    }
  }, [account, chainId]);

  return (
    <ChooseAddressStyle>
      <div className='box'>
        {active ? (
          <>
            <Row gutter={48}>
              <Col span={11}>
                <Space direction='vertical'>
                  <Title level={5}>From</Title>
                  <Select
                    placeholder='Select source chain'
                    value={bridgeAddress.sourceChain}
                    onChange={(value) => {
                      let targetChain = bridgeAddress.targetChain;
                      if (bridgeAddress.targetChain === value) {
                        targetChain = undefined;
                      }
                      setBridgeAddress({
                        ...bridgeAddress,
                        sourceChain: value,
                        targetChain,
                      });
                    }}
                  >
                    {chainList.map((chainItem) => (
                      <Option value={chainItem.id} key={chainItem.id}>
                        <img width={35} src={`/${chainItem.value}.svg`} />{' '}
                        {chainItem.name}
                      </Option>
                    ))}
                  </Select>
                  <div />
                  <Title level={5}>Source Address</Title>
                  <Web3ConnectButton block={true} />
                </Space>
              </Col>
              <Col span={2} className='arrow-container'>
                <ArrowRightOutlined />
              </Col>
              <Col span={11}>
                <Space direction='vertical'>
                  <Title level={5}>To</Title>
                  <Select
                    placeholder='Select target chain'
                    value={bridgeAddress.targetChain}
                    onChange={(value) => {
                      let sourceChain = bridgeAddress.sourceChain;
                      if (bridgeAddress.sourceChain === value) {
                        sourceChain = undefined;
                      }
                      setBridgeAddress({
                        ...bridgeAddress,
                        targetChain: value,
                        sourceChain,
                      });
                    }}
                  >
                    {chainList.map((chainItem) => (
                      <Option value={chainItem.id} key={chainItem.id}>
                        <img width={35} src={`/${chainItem.value}.svg`} />{' '}
                        {chainItem.name}
                      </Option>
                    ))}
                  </Select>
                  <div />
                  <Title level={5}>Target Address</Title>
                  <Tooltip
                    placement='bottomLeft'
                    trigger={['hover']}
                    title={bridgeAddress.targetAddress}
                    overlayInnerStyle={{
                      width: 370,
                      borderRadius: 8,
                    }}
                  >
                    <Input
                      placeholder='Fill recipient address'
                      value={bridgeAddress.targetAddress}
                      onChange={(e) =>
                        setBridgeAddress({
                          ...bridgeAddress,
                          targetAddress: e.target.value,
                        })
                      }
                    />
                  </Tooltip>
                </Space>
              </Col>
            </Row>
            <div className='next-container'>
              <Button type='primary' shape='round' onClick={validateAndNext}>
                Next
              </Button>
            </div>
          </>
        ) : (
          <div>
            <p className='address-detail'>
              From:{' '}
              <span className='address'>{bridgeAddress.sourceAddress}</span> (
              {
                getChainDataByChainId(chainList, bridgeAddress.sourceChain!)
                  ?.name
              }
              )
            </p>
            <p className='address-detail'>
              To: <span className='address'>{bridgeAddress.targetAddress}</span>{' '}
              (
              {
                getChainDataByChainId(chainList, bridgeAddress.targetChain!)
                  ?.name
              }
              )
            </p>
          </div>
        )}
      </div>
    </ChooseAddressStyle>
  );
};

export default ChooseAccount;
