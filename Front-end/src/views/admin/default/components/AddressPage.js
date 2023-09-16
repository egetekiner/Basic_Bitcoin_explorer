
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdBarChart, MdAttachMoney } from "react-icons/md";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import Transactions_Table from "views/admin/default/components/Address_table";

import USD from "assets/img/dashboards/usa.png";
import EUR from "assets/img/dashboards/euro.png";
import GBP from "assets/img/dashboards/gbp.png";


export default function AddressPage({ bitcoinAddress }) {
    // Chakra Color Mode
    
    
    const [bitcoinData, setBitcoinData] = useState(null);  
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [exchangeRates, setExchangeRates] = useState(null);


    useEffect(() => {
        const fetchBitcoinData = async () => {
            setIsLoading(true);
            setErrorMsg('');
            
            try {
                const btcResponse = await axios.get(`http://localhost:8000/rawaddr/${bitcoinAddress}`);
                setBitcoinData(btcResponse.data);
            
                try{const exchangeResponse = await axios.get(`http://localhost:8000/pricing_data`);
                setExchangeRates(exchangeResponse.data);
                console.log(exchangeResponse.data)
                } catch (error) {
                console.error("An error occurred while fetching data:", error);
                setErrorMsg('An error occurred while parsing the price data. Please try again.');
                }
                
                
                setHasSearched(true);
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
                setErrorMsg('An error occurred. Please try again.');
            }
            
            setIsLoading(false);
        };
        
        if (bitcoinAddress) {
            fetchBitcoinData();
        }
    }, [bitcoinAddress]);
    
    const totalBTC = bitcoinData ? bitcoinData.final_balance / 100000000 : 'Waiting For Data';
    const totalTransactions = bitcoinData ? bitcoinData.n_tx : 'Waiting For Data';
    const totalVolume = bitcoinData ? (bitcoinData.total_received / 100000000 + bitcoinData.total_sent / 100000000) : 'Waiting For Data';
    const [selectedCurrency, setSelectedCurrency] = useState('USD'); // New state to keep track of selected currency
        
        const handleCurrencyChange = (e) => {
          setSelectedCurrency(e.target.value.toUpperCase());
          return(e)
        };
      
        // Compute the current balance based on selected currency
        const computeCurrentBalance = () => {
          if (bitcoinData && exchangeRates && exchangeRates[selectedCurrency]) {
            return (bitcoinData.final_balance / 100000000) * exchangeRates[selectedCurrency].last;
          }
          return 'Fetching...';
        };

        return (
            <>

        {isLoading && <p>Loading...</p>}
        {errorMsg && <p>{errorMsg}</p>}
      
        {bitcoinData && ( 
        <> 

            <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
              <SimpleGrid
                columns={{ base: 1, md: 1, lg: 2, "2xl": 2 }}
                gap='40px'
                mb='60px'>
                <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Total BTC'
                  value={totalBTC} />

                <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Number of Transactions'
                  value={totalTransactions} />

              </SimpleGrid>

              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 2, "2xl": 2 }}
                gap='20px'
                mb='30px'>

                <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />} />}
                  name='Total Volume'
                  value={totalVolume} />

                <MiniStatistics
                  endContent={
                    <Flex me='-16px' mt='10px'>
                      <FormLabel htmlFor='balance'>
                        <Avatar src={
                          selectedCurrency === 'USD' ? USD :
                          selectedCurrency === 'EUR' ? EUR :
                          selectedCurrency === 'GBP' ? GBP : USD
                        } />
                      </FormLabel>
                      <Select
                      id='balance'
                      variant='mini'
                      mt='5px'
                      me='0px'
                      defaultValue='usd'
                      onChange={(e) => setSelectedCurrency(e.target.value.toUpperCase())}>

                    <option value='usd'>USD</option>
                    <option value='eur'>EUR</option>
                    <option value='gbp'>GBP</option>
                      
                    </Select>

                  
                  </Flex>}
                  name='Current Balance'
                  value={computeCurrentBalance()} />

                
              </SimpleGrid>

            </Box>

            <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
                <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' mb='20px'>

                {isLoading ? (
                    <p>Loading...</p> // Show loading indicator
                ) : (
                    <Transactions_Table transactions={bitcoinData && bitcoinData.txs ? bitcoinData.txs : []} /* other props */ />
                )}
                </SimpleGrid>
            </Box>
        
            
        </>
        )}
        </>

    );
      
}