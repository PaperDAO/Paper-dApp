import React, {useContext} from "react";
import { useState } from "react";
import styled from 'styled-components'
import {Box, ChakraProvider, Select} from "@chakra-ui/react";
import theme from "../theme";
import Layout from "../components/Layout";
import {Header, Text, MintedText, SubText} from '../components/Typography';
import ActionButton from '../components/ActionButton';
import { Textarea } from '@chakra-ui/react'
import { getSignContract } from "../utils";
import "@fontsource/inter";

import type { TSignContact } from '../types';
import {AppContext} from "../Router";

type EditorProps = {
  tokenId?: string;
};

const Editor = ({ tokenId }: EditorProps) => {
  const [value, setValue] = useState('')

  const [miningStatusMsg, setMiningStatusMsg] = useState('')

  const {userPapers, appData, refetchAppData, refetchUserPapers} = useContext(AppContext);

  const [currentTokenId, setCurrentTokenId] = useState<string>();

  const handleInputChange = (e:any) => {
    let inputValue = e.target.value
    setValue(inputValue)
  }



  const handleWriteAction = async() => {
    const valueArray = value.trim().split(" ");
    const { nftContract }: TSignContact = await getSignContract()

    let nftTx = await nftContract.typewrite(Number(currentTokenId), valueArray)
    setMiningStatusMsg(`Writing to blockchain....`)
    await nftTx.wait(2)
    refetchAppData()
    refetchUserPapers()
    setMiningStatusMsg(`Written!`)
  }

  function handleWhitepaperSelected(event: any) {
    setCurrentTokenId(event.target.value)
  }

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Header>Typewriter Paper</Header>
        <MintedText>#{appData?.numEdited || 0}/10000 written</MintedText>

        <Select placeholder='Select Whitepaper you Own' onChange={handleWhitepaperSelected} value={currentTokenId}>
          {userPapers?.length && userPapers.map(paper => <option value={paper.id}>Whitepaper #{paper.id} {paper.isEdited && "- Edited"}</option>)}
        </Select>
        {currentTokenId &&
            (<>
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
            {!!miningStatusMsg && <SubText>{miningStatusMsg}</SubText> }
            <ActionButton
          handleAction={handleWriteAction}
          width="300px"
          text="Write to the blockchain" />
          </Box></>)
        }
      </Layout>
    </ChakraProvider>
  );
}

export default Editor;