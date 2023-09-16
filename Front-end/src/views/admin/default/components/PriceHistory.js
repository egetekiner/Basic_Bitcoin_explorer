// External Libraries
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from "react-apexcharts";
import LineChart from "components/charts/LineChart";


// UI Components
import {
  Box,
  Flex,
  Button,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';

import { MdBarChart, MdOutlineCalendarToday } from 'react-icons/md';
import { RiArrowUpSFill } from 'react-icons/ri';

// Custom Components
import Card from 'components/card/Card.js';

export default function TradeVolume(props) {
  const [tradeVolumeData, setTradeVolumeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:8000/pricing_history_1month") // Replace with your API URL
      .then((response) => {
        const transformedData = transformTradeVolumeData(response.data);
        setTradeVolumeData(transformedData);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMsg(error.message);
        setIsLoading(false);
      });
  }, []);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");


  // Transform raw data into chart-friendly data
  const transformTradeVolumeData = (rawData) => {
    if (rawData && Array.isArray(rawData.values)) {
      return [
        {
          name: 'Price',
          data: rawData.values.map((item) => ({
            x: new Date(item.x * 1000),
            y: item.y
          }))
        }
      ];
    }
    console.error('Unexpected rawData:', rawData.values);
    return [];
  };

  // Chart options
  const chartOptions = {
    chart: {
      type: 'line',
      height: '100%',
      width: '100%'
    },
    xaxis: {
      type: 'date'
    },
    yaxis: {
      title: {
        text: 'Price (USD)'
      }
    }
  };

return (
    <Card justifyContent="center" align="center" direction="column" w="100%" mb="0px">
      <Flex justify="space-between" ps="0px" pe="20px" pt="5px">
        <Flex align="center" w="100%">
          <Button
            bg={boxBg}
            fontSize="sm"
            fontWeight="500"
            color={textColorSecondary}
            borderRadius="7px">
            <Icon as={MdOutlineCalendarToday} color={textColorSecondary} me="4px" />
            1 Year
          </Button>
          <Button
            ms="auto"
            align="center"
            justifyContent="center"
            bg={boxBg}
            borderRadius="10px"
            w="37px"
            h="37px">
            <Icon as={MdBarChart} color={textColor} w="24px" h="24px" />
          </Button>
        </Flex>
      </Flex>
      <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
        <Box minH="260px" minW="100%" mt="auto">
          <LineChart chartData={tradeVolumeData} chartOptions={chartOptions} />
        </Box>
      </Flex>
    </Card>
  );
}