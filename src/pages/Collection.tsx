import React from "react";
import styled from 'styled-components'
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import Layout from "../components/Layout";
import { Header } from "../components/Typography";
import "@fontsource/inter";

export const Market: any = () => {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Header>Collection</Header>
      </Layout>
    </ChakraProvider>
  );
}