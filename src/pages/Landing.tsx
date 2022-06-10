import React, { useContext, useMemo, useState, useEffect } from 'react';
import { Link as ReachLink } from "react-router-dom"
import { useEthers } from "@usedapp/core";
import {
  ChakraProvider,
  Text as ChackraText,
  Box,
  Link,
  Flex,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
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
import Prices from '../components/Prices';
import { AppContext } from "../Router";
import theme from "../theme";
import { checkCorrectNetwork, getSignContract, isMobileDevice, openMetaMaskUrl } from '../utils';
import { NetWorkName, nftContractAddress, metamaskAppDeepLink } from '../config'
import { MESSAGES, ROUTES } from './constants';

import type { TSignContact } from '../types';

const Landing = () => {
  const [miningStatus, setMiningStatus] = useState(0)
  const [miningStatusMsg, setMiningStatusMsg] = useState('')
  const [loadingState, setLoadingState] = useState(0)
  const [connectionMsg, setConnectionMsg] = useState('')
  const { account } = useEthers();

  const { refetchUserPapers, appData, refetchAppData } = useContext(AppContext);

  useEffect(() => {
    if (window.ethereum && isMobileDevice()) {
      connectWallet();
    }
  }, [])

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    setConnectionMsg('')

    try {
      const provider: any = await detectEthereumProvider();
      
      if (!provider) { 
        setConnectionMsg(MESSAGES.GET_META)
        return;
      }

      const correctNetwork = await checkCorrectNetwork()

      if (!correctNetwork) { 
        setConnectionMsg(`Change your network to ${NetWorkName}`)
      }

      else if (provider) {
        const ethProvider =  new ethers.providers.Web3Provider(provider)
        await ethProvider.send("eth_requestAccounts", []);

        await ethProvider.getSigner().getAddress();
        window.location.reload();
      }
    } catch (error) {
      setConnectionMsg(`${MESSAGES.CONNECT_ERROR}: ${error} `)
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
    setMiningStatus(0)
    
    try {
      const { signer, nftContract }: TSignContact = await getSignContract()

      const correctNetwork = await checkCorrectNetwork()

      if (!correctNetwork) {
        setConnectionMsg(`Change your network to ${NetWorkName}`)
        return;
      }


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
        setMiningStatusMsg('')
        refetchUserPapers();
        refetchAppData();
        // `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
      } else {
        console.log(MESSAGES.ETH_ERROR)
      }
    } catch (error) {
      console.log(MESSAGES.MINT_ERROR, error)
      // setTxError(error.message)
    }
  }

  const renderConnectButton = isMobileDevice() ?
    ( 
      <ActionButton
        handleAction={() => openMetaMaskUrl(metamaskAppDeepLink)}
        text={MESSAGES.CONNECT_WALLET} />
    ) : 
      <ActionButton
        handleAction={connectWallet}
        text={MESSAGES.CONNECT_WALLET} />

  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Header>
          White Paper
        </Header>
        <Text>By</Text>
        <Header>
          White Paper DAO
        </Header>
        <MintedText>#{appData?.numMinted || 0}/ 10,000</MintedText>
        {!!connectionMsg && (<ErrorText>{connectionMsg}</ErrorText>)}
        <Flex paddingBottom="30px">
          {!account ? renderConnectButton : 
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

        <SubText>
          {MESSAGES.NO_HARM}
        </SubText>
        <Prices />
        {miningStatusMsg && (
            <MintStatusText>
              {miningStatusMsg}
            </MintStatusText>
          )
        }
        {!!miningStatus && (
            <Link
              px={2}
              py={1}
              rounded={'md'}
              _hover={{
                textDecoration: 'none',
              }}
              as={ReachLink}
              to={ROUTES.EDIT}>
              <Flex mt={3}>
                <Box mt={2}>
                  <LinkText>
                    {MESSAGES.CONGRATS}
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