import React from "react";
import { useState } from "react";
import styled from 'styled-components'
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import Layout from "../components/Layout";
import { Header, Text, MintedText } from '../components/Typography';
import ActionButton from '../components/ActionButton';
import { Textarea } from '@chakra-ui/react'
import { getSignContract } from "../utils";
import "@fontsource/inter";

import type { TSignContact } from '../types';

type EditorProps = {
  tokenId?: string;
};

export const Editor = ({ tokenId }: EditorProps) => {
  const [value, setValue] = useState('')

  const handleInputChange = (e:any) => {
    let inputValue = e.target.value
    setValue(inputValue)
  }

  const handleWriteAction = async() => {
    // write to the chain
    const valueArray = value.trim().split(" ");
    const { nftContract }: TSignContact = await getSignContract()

    await nftContract.typewrite(tokenId, valueArray)
  }

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Header>Typewriter Paper</Header>
        <MintedText>x #/10000 written</MintedText>
        <Textarea
          height="500px"
          fontSize="14px"
          marginTop="20px"
          width="40%"
          value={value}
          _hover={{
            borderColor: "blue.100",
          }}
          _active={{
            borderColor: "blue.100",
          }}
          _focus={{
            borderColor: "blue.100",
          }}
          color="gray.500"
          onChange={handleInputChange}
          placeholder='Text editor'>
        </Textarea>
        <Box marginBottom="40px">
          <ActionButton
            handleAction={handleWriteAction}
            width="300px"
            text="Write to the blockchain" />
        </Box>
      </Layout>
    </ChakraProvider>
  );
}