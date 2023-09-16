import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { VSeparator } from "components/separator/Separator";

export default function PoolPieChart() {
  const [localChartData, setLocalChartData] = useState({labels: [], data: []});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  const transformPoolVolumeData = (rawData) => {
    const labels = Object.keys(rawData);
    const data = Object.values(rawData);
    return { labels, data };
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:8000/pool")
      .then((response) => {
        // console.log("Received data:", response.data); // Debug log
        const transformedData = transformPoolVolumeData(response.data);
        // console.log("Transformed data:", transformedData); // Debug log
        setLocalChartData(transformedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error occurred:", error.message); // Debug log
        setErrorMsg(error.message);
        setIsLoading(false);
      });
  }, []);



  const pieChartOptions = {
    labels: localChartData.labels,
    colors: ["#4318FF", ],
    chart: {
      width: "50px",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: ["#4318FF", "#6AD2FF", "#1E88E5", "#8E44AD", "#2ECC71", "#F1C40F", "#FF5733"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };


  return (
    <Card p="40px" w="100%" h="100%" direction="row" align="center">
    <Flex direction="row" w="100%" h="100%">
      {/* PieChart Card */}
      <Card 
        bg={cardColor} 
        boxShadow={cardShadow} 
        w="90%" 
        h="100%" 
        p="-5px"
      >
        <Text color={textColor} fontSize='md' fontWeight='600' mt='4px'>
          Mining Pool Distribution
        </Text>
        <PieChart
          h="400px"  // Adjust these to better fit your layout
          w="400px"
          chartData={localChartData.data}
          chartOptions={pieChartOptions}
        />
      </Card>
      
      {/* Mining Pool List Card */}
      <Card 
        bg={cardColor} 
        flexDirection="column" 
        boxShadow={cardShadow} 
        w="40%" 
        h="100%" 
        p="15px" 
        overflowY="auto" 
      >
          {localChartData.labels.map((label, index) => (
            <Flex direction='row' py='5px' key={index} alignItems='center' w='100%' justifyContent='space-between'>
              <Flex align='center'>
                <Box h='8px' w='8px' bg={pieChartOptions.colors[index % pieChartOptions.colors.length]} borderRadius='30%' me='4px' />
                <Text
                  fontSize='xs'
                  color='secondaryGray.600'
                  fontWeight='700'
                  mb='5px'>
                  {label}
                </Text>
              </Flex>
              <Text fontSize='lg' color={textColor} fontWeight='700'>
                {/* Display the number of blocks each pool has mined */}
                {`${localChartData.data[index]}`}
              </Text>
            </Flex>
          ))}
        </Card>
      </Flex>
    </Card>
  );
  
  
  

}
