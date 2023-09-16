import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { BitcoinLogo } from "components/icons/Icons";
import logo from "assets/img/Chainly_API_logo.png";  // Assuming the path is correct
import USD from 'assets/img/dashboards/usa.png';
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  // Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <p>Powered By</p>
      <img src={logo} alt="Chainly API Logo" />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;