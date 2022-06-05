import React, {useContext, useMemo} from 'react';
import { useState } from 'react'
import { nftContractAddress } from '../config'
import { useEthers } from "@usedapp/core";
import {
  ChakraProvider,
  Text as ChackraText,
  Box,
  Link,
  SimpleGrid,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import ActionButton from '../components/ActionButton';
import MarketLogos from '../components/MarketLogos';
import {
  Header,
  Text,
  MintedText,
  SubText,
  LinkText,
  MintStatusText,
  ErrorText
} from '../components/Typography';
import { Flex } from "@chakra-ui/react";
import theme from "../theme";
import { getSignContract } from '../utils';
import { Link as ReachLink } from "react-router-dom"

import { AppContext } from "../Router";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

import type { TSignContact } from '../types';

const Landing = () => {
  const [miningStatus, setMiningStatus] = useState(0)
  const [miningStatusMsg, setMiningStatusMsg] = useState('')
  const [loadingState, setLoadingState] = useState(0)
  const [correctNetworkMsg, setCorrectNetworkMsg] = useState('')
  const [txError] = useState(null)
  const { account } = useEthers();

  const { refetchUserPapers, appData, refetchAppData } = useContext(AppContext);


  	// Checks if wallet is connected to the correct network
	const checkCorrectNetwork = async () => {
		const { ethereum } = window
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)

		const polygonChainId = '0x89'

		return chainId === polygonChainId;
	}

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    setCorrectNetworkMsg('')

    try {
      const provider: any = await detectEthereumProvider();
      const correctNetwork = await checkCorrectNetwork()

      if (!correctNetwork) {
        setCorrectNetworkMsg("Change your network to Polygon")
      }

      else if (provider) {
        const ethProvider =  new ethers.providers.Web3Provider(provider)
        await ethProvider.send("eth_requestAccounts", []);

        await ethProvider.getSigner().getAddress();
        window.location.reload();
      }
    } catch (error) {
      setCorrectNetworkMsg(`Error connecting to metamask ${error.message}`)
    }
  }

  const mintPrice = useMemo(() => {
    const confPriceStart = 0;
    const confPriceInterval = 1000;
    const confPriceStep = 1;
    const tokenId = appData?.numMinted || 0;
    let xx = Math.floor((tokenId + 1)  / confPriceInterval);
    const price = confPriceStart + (xx * confPriceStep);
    return price;
  }, [appData])

  // Creates transaction to mint NFT on clicking Mint Character button
  const mintCharacter = async () => {
    try {
      const { signer, nftContract }: TSignContact = await getSignContract()
      
      if (signer) {
        const singerAddress= await signer.getAddress();

        let nftTx = await nftContract.mint(singerAddress,  {
          value: mintPrice * 10 ** 18
        });
        setMiningStatusMsg(`Mining.... ${nftTx.hash}`)
  
        let tx = await nftTx.wait(2)
        setLoadingState(1)
        setMiningStatusMsg(`Mined! ${tx}`)
        setMiningStatus(1)
        let event = tx.events[0]

        refetchUserPapers();
        refetchAppData();
        setMiningStatusMsg('')
        // `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log('Error minting character', error)
      // setTxError(error.message)
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Header>
          White Paper <br/>
        </Header>
        <Text>By</Text><br/>
        <Header>
          White Paper DAO
        </Header>
        <MintedText>#{appData?.numMinted || 0}/ 10,000</MintedText>
        {!!correctNetworkMsg && (<ErrorText>{correctNetworkMsg}</ErrorText>)}
        <Flex paddingBottom="30px">
          {!account ? (
            <>
              <ActionButton
                handleAction={connectWallet}
                text='Connect your Wallet'/>
            </>
            ) : 
            (
            <Flex
              marginTop="65px"
              marginRight="40px">
              <ChackraText color="gray.400" marginRight="5px">
                {account &&
                  `${account.slice(0, 6)}...${account.slice(
                    account.length - 4,
                    account.length
                  )}`
                }
              </ChackraText>
            </Flex>
            )
          }

          {account &&
          <ActionButton
            handleAction={mintCharacter}
            text='Mint'/>}
        </Flex>

        <SubText>No trees were harmed in the minting of this paper</SubText>
        <Box mt={4}>
          <SimpleGrid columns={2} gap={10}>
            <Box pr={5}>
              <SubText>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 – 1000 – Free mint + gas<br/>
                1001 – 2000 – 1.0 MATIC + gas<br/>
                2001 – 3000 – 2.0 MATIC + gas<br/>
                3001 – 4000 – 3.0 MATIC + gas<br/>
                &nbsp;4001 – 5000 – 4.0 MATIC + gas<br/>
              </SubText>
            </Box>
            <Box pl={5}>
              <SubText>
                5001 – 6000 – 5.0 MATIC + gas<br/>
                6001 – 7000 – 6.0 MATIC + gas<br/>
                7001 – 8000 – 7.0 MATIC + gas<br/>
                8001 – 9000 – 8.0 MATIC + gas<br/>
                &nbsp;9001 – 10000 – 9.0 MATIC + gas<br/>
              </SubText>
            </Box>
          </SimpleGrid>
        </Box>
        {miningStatusMsg && <MintStatusText>{miningStatusMsg}</MintStatusText>}
        {!!miningStatus && (
            <Link
              px={2}
              py={1}
              rounded={'md'}
              _hover={{
                textDecoration: 'none',
              }}
              as={ReachLink}
              to='/editor'>
              <Flex mt={3}>
                <Box mt={2}>
                  <LinkText>
                    CONGRATS! NOW YOU CAN TYPE ON YOUR WHITE PAPER {'>'}{'>'}
                  </LinkText>
                </Box>
              </Flex>
            </Link>
        )}
        <MarketLogos nftContractAddress={nftContractAddress} />
      </Layout>
    </ChakraProvider>
  )
}

export default Landing;