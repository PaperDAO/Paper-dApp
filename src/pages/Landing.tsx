import React, { useContext, useMemo, useState, useEffect } from 'react';
import { Link as ReachLink } from "react-router-dom"
import { useEthers } from "@usedapp/core";
import {
  Text as ChackraText,
  Box,
  Link,
  Flex,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import Layout from "../components/Layout";
import ActionButton from '../components/ActionButton';

import {
  Header,
  Text,
  MintedText,
  SubText,
  LinkText,
  MintStatusText,
  ErrorText
} from '../components/Typography';
// import Prices from '../components/Prices';
import { AppContext } from "../Router";
import { checkCorrectNetwork, getContract, isMobileDevice, openMetaMaskUrl } from '../utils';
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
      const { signer, nftContract }: TSignContact = await getContract()
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
      <Layout>
        <Header>
          White Paper
        </Header>
        <Text>By</Text>
        <Header>Whitepaper DAO</Header>
        <MintedText>Minted {appData?.numMinted || 0}/ 10,000</MintedText>
        {!!connectionMsg && (<ErrorText>{connectionMsg}</ErrorText>)}
        <Box maxWidth="500px" my="5">
          {/* Empty white paper */}
          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjQ5NCcgaGVpZ2h0PSczNTIzJyB2aWV3Qm94PScwIDAgMjQ5NCAzNTIzJyBmaWxsPSdub25lJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPiA8ZyBmaWx0ZXI9J3VybCgjZmlsdGVyMF9kXzE4MTVfMjAwNzUpJz4gPHBhdGggZD0nTTAgMC41SDI0ODBWMzUwOC41SDE4NC42NDJMMCAzMzA5Ljc5VjAuNVonIGZpbGw9J3doaXRlJy8+IDxwYXRoIGQ9J00xODcuMTQyIDMzMDkuNzlWMzMwNy4yOUgxODQuNjQySDIuNVYzSDI0NzcuNVYzNTA2SDE4Ny4xNDJWMzMwOS43OVpNMTgyLjE0MiAzMzEyLjI5VjM1MDIuMTRMNS43MzU1NiAzMzEyLjI5SDE4Mi4xNDJaJyBzdHJva2U9JyNBM0ExQTEnIHN0cm9rZS13aWR0aD0nNScvPiA8L2c+IDxkZWZzPiA8ZmlsdGVyIGlkPSdmaWx0ZXIwX2RfMTgxNV8yMDA3NScgeD0nMCcgeT0nMC41JyB3aWR0aD0nMjQ5NCcgaGVpZ2h0PSczNTIyJyBmaWx0ZXJVbml0cz0ndXNlclNwYWNlT25Vc2UnIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+IDxmZUZsb29kIGZsb29kLW9wYWNpdHk9JzAnIHJlc3VsdD0nQmFja2dyb3VuZEltYWdlRml4Jy8+PGZlQ29sb3JNYXRyaXggaW49J1NvdXJjZUFscGhhJyB0eXBlPSdtYXRyaXgnIHZhbHVlcz0nMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAnIHJlc3VsdD0naGFyZEFscGhhJy8+IDxmZU9mZnNldCBkeD0nMTAnIGR5PScxMCcvPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249JzInLz4gPGZlQ29tcG9zaXRlIGluMj0naGFyZEFscGhhJyBvcGVyYXRvcj0nb3V0Jy8+IDxmZUNvbG9yTWF0cml4IHR5cGU9J21hdHJpeCcgdmFsdWVzPScwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAnLz4gPGZlQmxlbmQgbW9kZT0nbm9ybWFsJyBpbjI9J0JhY2tncm91bmRJbWFnZUZpeCcgcmVzdWx0PSdlZmZlY3QxX2Ryb3BTaGFkb3dfMTgxNV8yMDA3NScvPiA8ZmVCbGVuZCBtb2RlPSdub3JtYWwnIGluPSdTb3VyY2VHcmFwaGljJyBpbjI9J2VmZmVjdDFfZHJvcFNoYWRvd18xODE1XzIwMDc1JyByZXN1bHQ9J3NoYXBlJy8+IDwvZmlsdGVyPjwvZGVmcz48L3N2Zz4=" />
        </Box>
        <Flex paddingBottom="30px" mt="2">
          {!account ? renderConnectButton : 
            (
              <Flex
                mt="2"
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
        {/* <Prices /> */}
        <Box my="5">
        {miningStatusMsg && (<MintStatusText>{miningStatusMsg}</MintStatusText>)}
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
        </Box>
      </Layout>
  )
}

export default Landing;