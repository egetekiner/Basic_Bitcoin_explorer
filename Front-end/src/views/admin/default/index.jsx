import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
  Input,
  Button,
} from "@chakra-ui/react";
import { BrowserRouter } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import MainPage from "./components/MainDashboard";

export default function UserReports() {
  const [inputData, setinputData] = useState("");
  const history = useHistory(); // for navigation
  
  const handleSearch = () => {
    history.push({
      pathname: '/admin/search',
      state: { inputData: inputData }
    });
  }

  

  return (
    <BrowserRouter>
      <Box pt={{ base: "120px", md: "80px", xl: "120px" }}>
        <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap='20px' bg="gray.200" borderRadius="20px">
          <Box height="20px"></Box>
          <Input 
            placeholder="Enter Bitcoin Address, Transaction Hash or Block Number" 
            value={inputData} 
            onChange={(e) => setinputData(e.target.value)} 
            bg="white"
            width="80%"
            marginLeft="auto"
            marginRight="auto"
          />
          <Box display="flex" justifyContent="center">
            <Button size="lg" mt="2" onClick={handleSearch}>
              Search
            </Button>
          </Box>
          <Box height="20px"></Box>
        </SimpleGrid>
        <MainPage />
      </Box>
    </BrowserRouter>
  );
}
