import React from 'react';
import { useState, useEffect } from 'react'
import detectEhereumProvider from '@metamask/detect-provider';
import { nftContractAddress } from '../config'
import { ethers } from 'ethers'
import axios from 'axios'
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/Layout";
import ActionButton from '../components/ActionButton';
import MarketLogos from '../components/MarketLogos';
import { Button, Flex } from "@chakra-ui/react";
import theme from "../theme";
import styled from 'styled-components'

const Text = styled.div`
  color: #edf0f0;
  font-size: 40px;
  text-align: center;
`
const Header = styled.div`
  color: #edf0f0;
  font-size: 70px;
  font-weight: 700;
  text-align: center;
`

const MintedText = styled(Text)`
  margin-top: 20px;
`

export const Landing = () => {
  const [mintedNFT, setMintedNFT] = useState(null)
  const [miningStatus, setMiningStatus] = useState(null)
  const [loadingState, setLoadingState] = useState(0)
  const [txError, setTxError] = useState(null)
  const [currentAccount, setCurrentAccount] = useState('')
  const [correctNetwork, setCorrectNetwork] = useState(false)

  async function getEtherProvider(){
    const provider  = await detectEhereumProvider();
    return new ethers.providers.Web3Provider(provider as any)
  }
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
  const checkCorrectNetwork = async () => {
    let chainId = await (window as any).ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain:' + chainId)

    const rinkebyChainId = '0x4'

    if (chainId !== rinkebyChainId) {
      setCorrectNetwork(false)
    } else {
      setCorrectNetwork(true)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    checkCorrectNetwork()
  }, [])

  // Creates transaction to mint NFT on clicking Mint Character button
  const mintCharacter = async () => {
    try {
        const provider = await getEtherProvider()
      if (provider) {
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(
          nftContractAddress,
          'NFT.abi', // TODO
          signer
        )

        let nftTx = await nftContract.createknft()
        console.log('Mining....', nftTx.hash)
        setMiningStatus(0 as any)

        let tx = await nftTx.wait()
        setLoadingState(1)
        console.log('Mined!', tx)
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
        )

        getMintedNFT(tokenId)
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log('Error minting character', error)
      // setTxError(error.message)
    }
  }

  // Gets the minted NFT data
  const getMintedNFT = async (tokenId:any) => {
    try {
      const provider = await getEtherProvider()
      if (provider) {
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(
          nftContractAddress,
          'NFT.abi', // TODO
          signer
        )

        let tokenUri = await nftContract.tokenURI(tokenId)
        let data = await axios.get(tokenUri)
        let meta = data.data

        setMiningStatus(1 as any)
        setMintedNFT(meta.image)
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
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
        <Flex>
          <ActionButton
            handleAction={connectWallet}
            text='Connect your Wallet'/>
          <ActionButton
            handleAction={mintCharacter}
            text='Mint'/>
        </Flex>
        <MintedText>x #/ 10,000</MintedText>
        <MarketLogos nftContractAddress={nftContractAddress} />
        {loadingState === 0 ? (
          miningStatus === 0 ? (
            txError === null ? (
              <div>
                <Text>
                  Processing your transaction
                </Text>

              </div>
            ) : (
              <div>{txError}</div>
            )
          ) : (
            <div></div>
          )
        ) : (
          <div>
            <Text>
              Your Eternal Domain Character
            </Text>
            <img
              src={mintedNFT as any}
              alt=''
            />
          </div>
      )}
      </Layout>
    </ChakraProvider>
  )
}