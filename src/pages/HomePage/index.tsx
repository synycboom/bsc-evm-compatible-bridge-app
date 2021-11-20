import Title from 'antd/lib/typography/Title';
import PageLayout from 'src/components/PageLayout';
import { useChainList } from 'src/helpers/wallet';
import HomePageStyle from './style';

const HomePage: React.FC = () => {
  const chainList = useChainList();
  return (
    <HomePageStyle>
      <PageLayout>
        <Title>
          BIFROST
          <br />
          Cross Chain NFT Bridge
        </Title>
        <div className='image-container'>
          {chainList.map((chain) => (
            <img src={`/${chain.value}.svg`} />
          ))}
        </div>
        <span className='bridge'>
          {`
                ▓▓░░▒▒░░░░░░░░▒▒▒▒▒▒▒▒░░  ▒▒  ░░░░                          
                ░░▒▒        ░░▒▒▒▒░░░░░░  ░░▒▒░░░░░░░░▒▒░░░░░░                  
                ░░▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▓▓▒▒▓▓▒▒▒▒▒▒▓▓▒▒            
              ░░▓▓▓▓░░        ░░▓▓▒▒    ▓▓▒▒▒▒▒▒  ▓▓▓▓▒▒▒▒      ▒▒▒▒            
              ▒▒░░░░▒▒      ░░▒▒▒▒▒▒    ░░▒▒▒▒░░  ▒▒░░▒▒▒▒      ▒▒▒▒▒▒          
            ░░░░    ░░░░    ▒▒▓▓  ▓▓░░▒▒  ▒▒▒▒  ▒▒  ░░░░░░    ░░  ░░▓▓          
          ░░▓▓  ░░    ▒▒  ░░░░▓▓  ░░▒▒    ░░▒▒  ▒▒  ▒▒  ▓▓    ░░  ░░░░▒▒        
          ▒▒    ▒▒      ░░▒▒  ▓▓    ▓▓▒▒    ▒▒░░  ▒▒░░  ▒▒▒▒░░    ░░  ▓▓        
        ░░░░            ▒▒░░  ▓▓  ▒▒  ▓▓  ▒▒░░░░  ░░▒▒  ░░▓▓░░    ░░  ░░▒▒      
      ░░▒▒            ░░░░▓▓  ▓▓░░░░  ▒▒▒▒▒▒▒▒  ▒▒  ▒▒  ░░░░▓▓    ░░    ▓▓      
      ▓▓        ░░  ░░▒▒    ▓▓▓▓▒▒      ██▒▒▒▒░░  ▒▒▓▓░░░░░░██    ░░    ░░░░    
    ▒▒░░        ▓▓▓▓▒▒      ██▓▓▓▓  ░░▒▒██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░▒▒▒▒▓▓    
  ░░██▒▒▒▒▒▒▓▓▓▓▓▓░░▒▒▒▒░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░▓▓░░  
░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒░░                    
          `}
        </span>
      </PageLayout>
    </HomePageStyle>
  );
};

export default HomePage;
