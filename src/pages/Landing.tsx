import React, { useContext, useMemo, useState, useEffect } from 'react';
import { Link as ReachLink } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { Text as ChackraText, Box, Link, Flex, Button } from '@chakra-ui/react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import Layout from '../components/Layout';
import ActionButton from '../components/ActionButton';
import EmptyPage from '../components/EmptyPage';
import {
    Header,
    Text,
    MintedText,
    SubText,
    LinkText,
    MintStatusText,
    ErrorText,
} from '../components/Typography';
import { AppContext } from '../Router';
import {
    checkCorrectNetwork,
    getContract,
    isMobileDevice,
    openMetaMaskUrl,
} from '../utils';
import { metamaskAppDeepLink } from '../config';
import { MESSAGES, ROUTES } from './constants';
import type { TSignContact } from '../types';

const Landing = () => {
    const [miningStatus, setMiningStatus] = useState(0);
    const [miningStatusMsg, setMiningStatusMsg] = useState('');
    const [loadingState, setLoadingState] = useState(0);
    const [connectionMsg, setConnectionMsg] = useState('');
    const { account } = useEthers();

    const { refetchUserPapers, appData, refetchAppData } =
        useContext(AppContext);

    useEffect(() => {
        if (window.ethereum && isMobileDevice()) {
            connectWallet();
        }
    }, []);

    // Calls Metamask to connect wallet on clicking Connect Wallet button
    const connectWallet = async () => {
        setConnectionMsg('');

        try {
            const provider: any = await detectEthereumProvider();
            if (!provider) {
                setConnectionMsg(MESSAGES.GET_META);
                return;
            }
            const correctNetwork = await checkCorrectNetwork();
            if (!correctNetwork) {
                setConnectionMsg(
                    `Change your network to ${process.env.REACT_APP_NETWORK_NAME}`,
                );
            } else if (provider) {
                const ethProvider = new ethers.providers.Web3Provider(provider);
                await ethProvider.send('eth_requestAccounts', []);
                await ethProvider.getSigner().getAddress();
                window.location.reload();
            }
        } catch (error) {
            setConnectionMsg(`${MESSAGES.CONNECT_ERROR}: ${error} `);
        }
    };

    // Creates transaction to mint NFT on clicking Mint Character button
    const mintCharacter = async () => {
        setMiningStatus(0);

        try {
            const { signer, nftContract }: TSignContact = await getContract();
            const correctNetwork = await checkCorrectNetwork();
            if (!correctNetwork) {
                setConnectionMsg(
                    `Change your network to ${process.env.REACT_APP_NETWORK_NAME}`,
                );
                return;
            }
            if (signer) {
                const singerAddress = await signer.getAddress();

                let nftTx = await nftContract.mint(singerAddress);
                setMiningStatusMsg(`Mining.... ${nftTx.hash}`);

                let tx = await nftTx.wait(2);
                setLoadingState(1);
                setMiningStatusMsg(`Mined! ${tx}`);
                setMiningStatus(1);
                setMiningStatusMsg('');
                refetchUserPapers();
                refetchAppData();
                // `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
            } else {
                console.log(MESSAGES.ETH_ERROR);
            }
        } catch (error) {
            console.log(MESSAGES.MINT_ERROR, error);
            // setTxError(error.message)
        }
    };

    return (
        <Layout>
            <Header>White Paper</Header>
            <Text>By</Text>
            <Header>Whitepaper DAO</Header>
            <Text>
                Eternalize your thoughts as NFTs. Mint a white paper and write
                on it whatever you feel like.
            </Text>
            {/* <MintedText>Minted {appData?.numMinted || 0}/ 10,000</MintedText> */}
            {!!connectionMsg && <ErrorText>{connectionMsg}</ErrorText>}
            {/* Empty white paper */}
            <Box maxWidth="250px" my="5">
                <EmptyPage />
            </Box>
            <Box></Box>
            <Flex paddingBottom="30px" mt="2" justifyContent="center">
                {/* {!account && (
                    <Flex mt="2" marginRight="40px">
                        <ChackraText color="gray.400" marginRight="5px">
                            {account &&
                                `${account.slice(0, 6)}...${account.slice(
                                    account.length - 4,
                                    account.length,
                                )}`}
                        </ChackraText>
                    </Flex>
                )} */}
                {account && (
                    <Link
                        href="/write"
                        _hover={{
                            textDecoration: 'none',
                        }}
                    >
                        <Button
                            width="200px"
                            fontSize="lg"
                            fontWeight="bold"
                            borderWidth="3px"
                            borderRadius="xl"
                            border="2px solid transparent"
                            _hover={{
                                borderColor: 'blue.100',
                                color: 'blue.100',
                                textDecoration: 'none',
                                underline: 'none',
                            }}
                            size="lg"
                            marginRight="20px"
                            variant="outline"
                            color="gray.400"
                            borderColor="gray.300"
                        >
                            Mint your own Paper
                        </Button>
                    </Link>
                )}
            </Flex>
            <SubText>{MESSAGES.NO_HARM}</SubText>
            <Box textAlign="center" mt="10">
                {!account &&
                    (isMobileDevice() ? (
                        <ActionButton
                            handleAction={() =>
                                openMetaMaskUrl(metamaskAppDeepLink)
                            }
                            text={MESSAGES.CONNECT_WALLET}
                        />
                    ) : (
                        <ActionButton
                            handleAction={connectWallet}
                            text={MESSAGES.CONNECT_WALLET}
                        />
                    ))}
            </Box>
            <Box my="5">
                {miningStatusMsg && (
                    <MintStatusText>{miningStatusMsg}</MintStatusText>
                )}
                {!!miningStatus && (
                    <Link
                        px={2}
                        py={1}
                        rounded={'md'}
                        _hover={{
                            textDecoration: 'none',
                        }}
                        as={ReachLink}
                        to={ROUTES.EDIT}
                    >
                        <Flex mt={3}>
                            <Box mt={2}>
                                <LinkText>{MESSAGES.CONGRATS}</LinkText>
                            </Box>
                        </Flex>
                    </Link>
                )}
            </Box>
        </Layout>
    );
};

export default Landing;
