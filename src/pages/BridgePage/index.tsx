import Title from 'antd/lib/typography/Title';
import PageLayout from 'src/components/PageLayout';
import Button from 'src/components/Button';
import { useEffect, useState } from 'react';
import Steps from 'antd/lib/steps';
import ChooseAddress from 'src/components/ChooseAddress';
import ChooseNFTModal from 'src/components/ChooseNFTModal';
import { useRecoilState } from 'recoil';
import { nftState, stepDataState } from 'src/state/bridge';
import NFTDetail from 'src/components/NFTDetail';
import { useWeb3React } from '@web3-react/core';
import BridgePageStyle from './style';
import TransferNFT from 'src/components/TransferNFT';
import { EMPTY_NFT_DATA } from 'src/constances/nft';
import { TransferStatus } from 'src/interfaces/nft';

const { Step } = Steps;

const BridgePage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nft, setNft] = useRecoilState(nftState);
  const [stepData, setStepData] = useRecoilState(stepDataState);
  const { account, chainId } = useWeb3React();
  const { step, transferStatus } = stepData;

  const setStep = (value: number) => {
    setStepData({
      step: value + 1,
      transferStatus: TransferStatus.NotStart,
    });
  };

  const next = () => {
    setStep(step);
  };

  const confirmModal = () => {
    setIsModalVisible(false);
  };
  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    setNft(EMPTY_NFT_DATA);
  }, [account, chainId]);

  const isDone = transferStatus === TransferStatus.Done;

  return (
    <BridgePageStyle>
      <ChooseNFTModal
        visible={isModalVisible}
        onOk={confirmModal}
        onCancel={closeModal}
      />
      <PageLayout>
        <div className='header'>
          <Title level={2}>Cross Chain NFT Bridge</Title>
        </div>
        <Steps
          current={step}
          onChange={(value) => {
            if (value <= step) setStep(value);
          }}
          direction='vertical'
        >
          <Step
            disabled={step === 2 || isDone}
            title='Step 1: Choose Address'
            description={<ChooseAddress active={step === 0} next={next} />}
          />
          <Step
            disabled={step < 1 || isDone}
            title='Step 2: Select NFT'
            description={
              <div className='box'>
                {!!nft.contractAddress ? (
                  <NFTDetail disabled={step !== 1} next={next} />
                ) : (
                  <>
                    <p>
                      <b>Select an NFT to transfer through NFT Bridge</b>
                    </p>
                    {step === 1 && (
                      <Button
                        type='primary'
                        className='blue'
                        style={{ marginTop: 8 }}
                        shape='round'
                        onClick={() => setIsModalVisible(true)}
                      >
                        Select NFT
                      </Button>
                    )}
                  </>
                )}
              </div>
            }
          />
          <Step
            disabled={step < 2}
            title='Step 3: Transfer NFT'
            description={
              <div className='box'>
                <p>
                  <b>Transfer NFT throught Bridge</b>
                </p>
                {step === 2 && <TransferNFT />}
              </div>
            }
          />
        </Steps>
      </PageLayout>
    </BridgePageStyle>
  );
};

export default BridgePage;
