
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMemo } from 'react';
import {
  useTable,
  usePagination,
  useSortBy
} from 'react-table';
import { MdBarChart, MdAttachMoney } from "react-icons/md";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import BlockTable from  "views/admin/default/components/BlockTable";



export default function AddressPage({ blockHeight }) {
    // Chakra Color Mode
    
   
    const [blockData, setBlockData] = useState(null); 
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const [transactions, setTransactions] = useState(null);

    useEffect(() => {
        const fetchBlockData = async () => {
            try {
              const response = await axios.get(`http://localhost:8000/block-height/${blockHeight}`);
              setBlockData(response.data);
              if (response.data && response.data.blocks && response.data.blocks[0]) {
                setTransactions(response.data.blocks[0].tx); // Assuming tx is the field for transactions
              }
            } catch (error) {
              console.error("An error occurred while fetching block data:", error);
            }
          };
      
          if (blockHeight) {
            fetchBlockData();
          }
        }, [blockHeight]);


    // const totalBTC = bitcoinData ? bitcoinData.final_balance / 100000000 : 'Waiting For Data';
    // 
    const blockHash = blockData ? blockData.blocks[0].hash : 'Waiting for data';
    const n_tx = blockData ? blockData.blocks[0].n_tx : 'Waiting for data';
    const block_index = blockData ? blockData.blocks[0].block_index : 'Waiting for data';
    

    const columnsData = useMemo(() => [
        {
          Header: "Transaction Index",
          accessor: "index"
        },
        {
          Header: "Transaction Hash",
          accessor: "hash"
        },
        {
          Header: "Inputs",
          accessor: "vin_sz"
        },
        {
          Header: "Outputs",
          accessor: "vout_sz"
        }
    ], []);

    const data = useMemo(() => {
        if (transactions) {
          return transactions.map((transaction, index) => ({
            index: index,  // Transaction index
            hash: transaction.hash,  // Transaction hash
            vin_sz: transaction.vin_sz,  // Number of inputs
            vout_sz: transaction.vout_sz  // Number of outputs
          }));
        }
        return [];
      }, [transactions]);
    


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
      } = useTable({ columns: columnsData, data });
      
    // Compute the current balance based on selected currency

        return (
            <>
            <Box pt={{ base: "80px", md: "50px", xl: "80px" }}>
              <SimpleGrid
                columns={{ base: 1, md: 1, lg: 1, "2xl": 1 }}
                gap='40px'
                mb='60px'>
                <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Block Hash'
                  value={blockHash} />

              </SimpleGrid>

            </Box>

            <Box pt={{ base: "130px", md: "30px", xl: "80px" }}>
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
                  name='Number of transactions'
                  value={n_tx} />
                
                <MiniStatistics
                  startContent={<IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={<Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />} />}
                  name='Block index'
                  value={block_index} />

              </SimpleGrid>

            </Box>

            <div>
            
            <BlockTable blocks={data} />

            </div>

            

        
            
        </>
        

    );
      
}