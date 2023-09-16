import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Select,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';

import MiniStatistics from 'components/card/MiniStatistics';
import BlockchainDataInstance from 'views/admin/default/components/GetData';
import PoolPieCard from 'views/admin/default/components/PoolPieChart';
import TradeVolume from 'views/admin/default/components/TradeVolume';
import PricingHistory from 'views/admin/default/components/PriceHistory';
import { MdBarChart } from 'react-icons/md';
import IconBox from "components/icons/IconBox";

import USD from 'assets/img/dashboards/usa.png';
import EUR from 'assets/img/dashboards/euro.png';
import GBP from 'assets/img/dashboards/gbp.png';

export default function MainDashboard() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState(null);
  const [statData, setStatData] = useState(null);
  const [poolData, setPoolData] = useState(null);
  const [tradeVolumeData, setTradeVolumeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const brandColor = useColorModeValue("brand.500", "white");


  const HashRate = statData ? statData.hash_rate : 'Waiting For Data';
  const minutes_between_blocks = statData ? statData.minutes_between_blocks : 'Waiting For Data';
  const total_mined_BTC = statData ? statData.totalbc : 'Waiting For Data';
  const Block_index = statData ? statData.n_blocks_total : 'Waiting For Data';
  const trade_volume_btc = statData ? statData.trade_volume_btc : 'Waiting For Data';
  const trade_volume_usd = statData ? statData.trade_volume_usd : 'Waiting For Data';
  const [isLoadingData, setIsLoadingData] = useState(true);


  function formatNumber(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num;
  }
  
  useEffect(() => {
    // Check if we are still loading data
    if (isLoadingData) {
      fetchData(); // Execute data fetching logic
  
      // Assuming fetchData() updates the state variables upon completion
      // setIsLoadingData(false); // Uncomment this line when data fetching is done
    }
  }, [isLoadingData]);


  async function fetchData() {
    setIsLoading(true);

    try {
      const pricingData = await BlockchainDataInstance.getPricingData();
      setExchangeRates(pricingData);

      const fetchedStatData = await BlockchainDataInstance.getStatsData();
      setStatData(fetchedStatData);

      const fetchedPoolData = await BlockchainDataInstance.getPoolData();
      setPoolData(fetchedPoolData);

      const fetchedTradeVolumeData = await BlockchainDataInstance.getTradeVolumeData1Year();
      setTradeVolumeData(fetchedTradeVolumeData);

      setIsLoading(false);
    } catch (error) {
      setErrorMsg('An error occurred while fetching data. Please try again.');
      setIsLoading(false);
    }
  }


  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };

  const getCurrentRate = () => {
    if (exchangeRates && exchangeRates[selectedCurrency]) {
      return exchangeRates[selectedCurrency].last;
    }
    return 'Fetching...';
  };

  return (
    
   <>
      {isLoading && <p>Loading...</p>}
      {errorMsg && <p>{errorMsg}</p>}

      {!isLoading && statData && exchangeRates && poolData && tradeVolumeData && (
    <>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }} gap='20px' mb='20px' alignItems="center"
  justifyItems="center"> 
          
          <MiniStatistics
            endContent={
              <Flex me='-16px' mt='10px'>
                <FormLabel htmlFor='balance'>
                  <Avatar
                    src={
                      selectedCurrency === 'USD'
                        ? USD
                        : selectedCurrency === 'EUR'
                        ? EUR
                        : selectedCurrency === 'GBP'
                        ? GBP
                        : USD
                    }
                  />
                </FormLabel>
                <Select
                  id='balance'
                  variant='mini'
                  mt='5px'
                  me='0px'
                  defaultValue='usd'
                  onChange={handleCurrencyChange}
                >
                  <option value='usd'>USD</option>
                  <option value='eur'>EUR</option>
                  <option value='gbp'>GBP</option>
                </Select>
              </Flex>
            }
            name='Current Rates'
            value={getCurrentRate()}
            growth='-23%'
          />

            <MiniStatistics
            startContent={<IconBox
                w='56px'
                h='56px'
                bg={boxBg}
                icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                name='Latest Block'
                value={Block_index} />

            <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Total BTC Mined'
                  value={total_mined_BTC / 100000000} />

            <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Minutes Between Blocks'
                  value={minutes_between_blocks} />            
        </SimpleGrid>

    
      </Box>
      <PricingHistory mb="80px"/>
      <Box height="20px"></Box>
      <TradeVolume trade_volume_btc={trade_volume_btc} trade_volume_usd={formatNumber(trade_volume_usd)} />
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, md: 1, lg: 1, '2xl': 2 }} gap='20px' mb='30px'> 
        
        <PoolPieCard mb="80px"/>

        <SimpleGrid columns={{ base: 1, md: 1, lg: 1, '2xl': 1 }} gap='20px' mb='30px'> 
        
        <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Total Hash Rate'
                  value={HashRate} />        

        <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Last Mined Block Index'
                  value={Block_index} />


        <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Trade Volume'
                  value={trade_volume_btc} />

        


        </SimpleGrid>


        </SimpleGrid>
      </Box>
      
      </>
      )}
    </>
  );
}
