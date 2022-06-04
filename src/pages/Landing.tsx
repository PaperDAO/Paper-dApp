import React from "react";
import styled from 'styled-components'
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import theme from "../theme";
import Layout from "../components/Layout";

import ConnectButton from "../components/ConnectButton";
import AccountModal from "../components/AccountModal";
import "@fontsource/inter";

const Header = styled.div`
  color: white;
`

export const Landing: any = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <AccountModal isOpen={isOpen} onClose={onClose} /> 
      </Layout>
    </ChakraProvider>
  );
}