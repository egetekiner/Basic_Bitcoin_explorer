
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



export default function AddressPage({transaction_hash}) {
    // Chakra Color Mode
    console.log(transaction_hash)

    const [tx_data, setTxData] = useState(null);  
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [hasSearched, setHasSearched] = useState(false);


    useEffect(() => {
        const fetchBitcoinData = async () => {
            setIsLoading(true);
            setErrorMsg('');
            
            try {
                const btcResponse = await axios.get(`http://localhost:8000/rawtx/${transaction_hash}`);
                setTxData(btcResponse.data);    
                setHasSearched(true);
                // console.log(btcResponse.data)

            } catch (error) {
                console.error("An error occurred while fetching data:", error);
                setErrorMsg('An error occurred. Please try again.');
            }
            
            setIsLoading(false);
        };
        
        if (transaction_hash) {
            fetchBitcoinData();
        }
    }, [transaction_hash]);

    const Hash = tx_data ? tx_data.hash : 'Waiting for data';
    const vin_sz = tx_data ? tx_data.vin_sz : 'Waiting for data';
    const vout_sz = tx_data ? tx_data.vout_sz : 'Waiting for data';
    const block_index = tx_data ? tx_data.block_height : 'Waiting for data';
    const fee = tx_data ? tx_data.fee : 'Waiting for data';
        
        return (
            <>

        {isLoading && <p>Loading...</p>}
        {errorMsg && <p>{errorMsg}</p>}
      
        {tx_data && ( 
        <> 

            <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
              <SimpleGrid
                columns={{ base: 1, md: 1, lg: 1, "2xl": 2 }}
                gap='40px'
                mb='60px'>
                <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Transaction Hash'
                  value={Hash} />
                </SimpleGrid>

              <SimpleGrid
                columns={{ base: 1, md: 1, lg: 2, "2xl": 6 }}
                gap='40px'
                mb='60px'>
                <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Inputs'
                  value={vin_sz} />

                <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Outputs'
                  value={vout_sz} />

              </SimpleGrid>

              <SimpleGrid
                columns={{ base: 1, md: 1, lg: 2, "2xl": 6 }}
                gap='40px'
                mb='60px'>
                <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Block Number'
                  value={block_index} />

                <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Fee'
                  value={fee} />

              </SimpleGrid>

              
            </Box>
        
            
        </>
        )}
        </>

    );
      
}