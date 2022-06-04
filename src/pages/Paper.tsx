import React from "react";
import styled from 'styled-components'
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import Layout from "../components/Layout";
import "@fontsource/inter";

const Header = styled.div`
  color: white;
`

export const Paper: any = () => {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Header>Paper</Header>
      </Layout>
    </ChakraProvider>
  );
}