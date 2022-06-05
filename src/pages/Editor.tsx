import React, {useContext, useEffect} from "react";
import { useState } from "react";
import styled from 'styled-components'
import { Box, ChakraProvider, Input, Select } from "@chakra-ui/react";
import theme from "../theme";
import Layout from "../components/Layout";
import { Header, Text, MintedText, SubText, MintStatusText } from '../components/Typography';
import ActionButton from '../components/ActionButton';
import { Textarea } from '@chakra-ui/react'
import {getPaperMetadata, getSignContract} from "../utils";
import "@fontsource/inter";

import type { TSignContact } from '../types';
import { AppContext, Paper } from "../Router";

const Title = styled.div`
  color: #cacbcc;
  font-size: 34px;
  font-weight: 700;
  text-align: center;
`

const Editor = () => {
  const [value, setValue] = useState('')
  const [pageName, setPageName] = useState('')

  const [miningStatusMsg, setMiningStatusMsg] = useState('')
  const {userPapers, appData, refetchAppData, refetchUserPapers} = useContext(AppContext);
  const [currentTokenId, setCurrentTokenId] = useState<string>();

  const handleInputChange = (e:any) => {
    let inputValue = e.target.value
    inputValue = inputValue.replace(/(.{80})/g, "$1\n")
    setValue(inputValue)
  }

  const handlePageNameChanged = (e: any) => {
    setPageName(e.target.value)
  }


  const handleWriteAction = async() => {
    let valueArray = value.split("\n");
    valueArray  = valueArray.map(line => !line ? ' ' : line);
    const { nftContract }: TSignContact = await getSignContract()
    let nftTx = await nftContract.typewrite(Number(currentTokenId),pageName, valueArray)
    setMiningStatusMsg(`Writing to blockchain....`)
    await nftTx.wait(2)
    refetchAppData()
    refetchUserPapers()
    setMiningStatusMsg(`Written!`)
    setValue('')
    setPageName('')
  }

  function handleWhitepaperSelected(event: any) {
    setMiningStatusMsg('')
    setCurrentTokenId(event.target.value)
  }

  useEffect(() => {
    if (userPapers?.length === 1) {
      setCurrentTokenId("1");
    }

  }, [userPapers]);

  const currentPaper =  !!userPapers?.length ? userPapers.find((paper: Paper) => paper.id === currentTokenId?.toString()) : undefined;

  const RenderSvg = ({ image_data }: { image_data: string }) => {
    const buff = new Buffer(image_data);
    const base64data = buff.toString('base64');
    return <img src={`data:image/svg+xml;base64,${base64data}`} />
  }

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Header>Typewriter Paper</Header>
        <MintedText>#{appData?.numEdited || 0}/10000 written</MintedText>

        <Select borderWidth="3px" width="50%" placeholder='Select Whitepaper you own..' onChange={handleWhitepaperSelected} value={currentTokenId}>
          {userPapers?.length && userPapers.map(paper => <option  key={paper.id} value={paper.id}>Whitepaper #{paper.id} {!!paper.paperTitle && ` - ${paper.paperTitle}` }</option>)}
        </Select>

        {currentPaper?.isEdited &&
          <Box w='60%'  mt={20} onClick={() => {}}>
             <Title>{currentPaper?.paperTitle}</Title>
            <RenderSvg image_data={currentPaper.metadata?.image_data} />
          </Box>
        }

        {currentPaper && !currentPaper.isEdited &&
          (<>
            <Input
                 fontSize="14px"
                 marginTop="20px"
                 width="40%"
                 onChange={handlePageNameChanged}
                                borderWidth="3px"
                                value={pageName}
                                _hover={{
                                  borderColor: "blue.100",
                                }}
                                _active={{
                                  borderColor: "blue.100",
                                }}
                                _focus={{
                                  borderColor: "blue.100",
                                }} placeholder={"Paper title"} />
            <Textarea
              height="700px"
              fontSize="14px"
              marginTop="20px"
              width="550px"
              borderWidth="3px"
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
            {!!miningStatusMsg && <MintStatusText>{miningStatusMsg}</MintStatusText>}
          </>)
        }
      </Layout>
    </ChakraProvider>
  );
}

export default Editor;