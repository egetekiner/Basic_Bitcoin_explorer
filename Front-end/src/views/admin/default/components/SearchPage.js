import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";

import AddressModule from "./AddressPage";
import BlockModule from "./BlockPage";
import TransactionModule from "./TransactionsPage";
import MainPage from "./MainDashboard";

import {
    Avatar,
    Flex,
    Box,
    FormLabel,
    Icon,
    Select,
    SimpleGrid,
    useColorModeValue,
    Input,
    Button,
    Spinner,
  } from "@chakra-ui/react";


export default function SearchPage() {

  const location = useLocation();
  const { inputData } = location.state || {};
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isValidBlock, setIsValidBlock] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchInput, setSearchInput] = useState(inputData || "");

  useEffect(() => {
    if (inputData) {
      fetchBitcoinData();
    }
  }, [inputData]);
  
  const fetchBitcoinData = async () => {
    if (/^[a-fA-F0-9]{64}$/.test(searchInput)) {
      setIsValidBlock(false);
      setIsValidAddress(false);
      setHasSearched(true);
      console.log('Transaction')
    } else if (/^[0-9]+$/.test(searchInput)) {
      setIsValidAddress(false);
      setIsValidBlock(true);
      setHasSearched(true);
      console.log('Block Number')
    } else {
      setIsValidBlock(false);
      setIsValidAddress(true);
      setHasSearched(true);
      console.log('Address')
    }
  }

  const renderModule = () => {
    if (isValidAddress) {
      return <AddressModule bitcoinAddress={searchInput} />;
    } else if (isValidBlock) {
      return <BlockModule blockHeight={searchInput} />;
    } else {
      // If it's not a valid address or block, render the TransactionModule by default
      console.log(searchInput)
      return <TransactionModule transaction_hash={searchInput} />;
    }
  }

  return (
    <>
      <Box pt={{ base: "120px", md: "80px", xl: "120px" }}>
        <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' bg="gray.200" borderRadius="20px">
          <Box height="20px"></Box>
          <Input 
            placeholder="Enter Bitcoin Address, Transaction Hash or Block Number" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            bg="white"
            width="80%"
            marginLeft="auto"
            marginRight="auto"
          />
          <Box display="flex" justifyContent="center">
            <Button size="lg" mt="2" onClick={() => fetchBitcoinData(searchInput)}>
              Search
            </Button>
          </Box>
          <Box height="20px"></Box>
        </SimpleGrid>
      </Box>

      <Box pt={{ base: "120px", md: "80px", xl: "120px" }}>
        {hasSearched ? (
          renderModule()
        ) : (
          <Spinner size="s" />
        )}
      </Box>
    </>
  );
}
