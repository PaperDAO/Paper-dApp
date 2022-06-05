import React from 'react';
import { useState, useEffect } from 'react'
import detectEhereumProvider from '@metamask/detect-provider';
import { nftContractAddress } from '../config'
import { useEthers } from "@usedapp/core";
import NFT from '../Whitepaper.json';
import { ethers } from 'ethers'
import { ChakraProvider, Text as ChackraText, Button } from "@chakra-ui/react";
import { Editor } from './Editor';
import Identicon from "../components/Identicon";
import Layout from "../components/Layout";
import ActionButton from '../components/ActionButton';
import MarketLogos from '../components/MarketLogos';
import { Header, Text, MintedText, SubText } from '../components/Typography';
import { Flex } from "@chakra-ui/react";
import theme from "../theme";
import { getSignContract } from '../utils';
import styled from 'styled-components'

import type { TSignContact } from '../types';

export const Landing = () => {
  const [miningStatus, setMiningStatus] = useState(null)
  const [miningStatusMsg, setMiningStatusMsg] = useState('')
  const [loadingState, setLoadingState] = useState(0)
  const [txError, setTxError] = useState(null)
  const [currentAccount, setCurrentAccount] = useState('')
  const [network, setNetwork] = useState(0)
  const [showEditor, setShowEditor] = useState(true)
  const [currentToken, setToken] = useState('')
  const { account } = useEthers();

  console.log({loadingState})
  console.log({miningStatus})
  console.log({txError})

  // Checks if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log('Got the ethereum obejct: ', ethereum)
    } else {
      console.log('No Wallet found. Connect Wallet')
    }

    const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      console.log('Found authorized Account: ', accounts[0])
      setCurrentAccount(accounts[0])
    } else {
      console.log('No authorized account found')
    }
  }

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await (window as any).ethereum.request({ method: 'eth_chainId'})
      console.log('Connected to chain:' + chainId)

      const rinkebyChainId = '0x4'

      if (chainId !== rinkebyChainId) {
        alert('You are not connected to the Rinkeby Testnet!')
        return
      }

      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }

  // Checks if wallet is connected to the correct network
  const checkNetwork = async () => {
    let chainId = await (window as any).ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain:' + chainId)

    const rinkebyChainId = '0x4'

    if (chainId !== rinkebyChainId) {
      setNetwork(1)
    } else {
      setNetwork(2)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    checkNetwork()
  }, [])

  // Creates transaction to mint NFT on clicking Mint Character button
  const mintCharacter = async () => {
    try {
      const { signer, nftContract }: TSignContact = await getSignContract()
      
      if (signer) {
        const singerAddress= await signer.getAddress();
        let nftTx = await nftContract.mint(singerAddress)
        setMiningStatusMsg(`Mining.... ${nftTx.hash}`)
  

        let tx = await nftTx.wait()
        setLoadingState(1)
        setMiningStatusMsg(`Mined! ${tx}`)
        setMiningStatus(1 as any)
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        setToken(tokenId)
        setMiningStatusMsg(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
        )
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
        <Text>
          One free mint + Gas <br/>
          Per wallet
        </Text>
        <SubText>No trees were harmed in the minting of this paper</SubText>
        <Flex>
          {!account ? (
            <ActionButton
              handleAction={connectWallet}
              text='Connect your Wallet'/>
            ) : 
            (
            <Flex
              marginTop="65px"
              marginRight="40px">
              <ChackraText color="gray.300" marginRight="5px">
                {account &&
                  `${account.slice(0, 6)}...${account.slice(
                    account.length - 4,
                    account.length
                  )}`
                }
              </ChackraText>
              <Identicon />
            </Flex>
            )
          }
          <ActionButton
            handleAction={mintCharacter}
            text='Mint'/>
        </Flex>
        <SubText>{miningStatusMsg}</SubText>
        {miningStatus && (
          <Button
            value='Mint'/>
          )
        }
        <MintedText>x #/ 10,000</MintedText>
        <MarketLogos nftContractAddress={nftContractAddress} />
      </Layout>
    </ChakraProvider>
  )
}