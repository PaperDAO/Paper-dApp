import React from 'react';
import { Button, Box, Text } from '@chakra-ui/react';
import { useEthers, useEtherBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import { sliceAccount } from '../utils';

type Props = {
    handleOpenModal?: any;
};

export default function ConnectButton({ handleOpenModal }: Props) {
    const { activateBrowserWallet, account, library } = useEthers();
    const etherBalance = useEtherBalance(account);

    function handleConnectWallet() {
        activateBrowserWallet();
    }

    return account ? (
        <Box
            display="flex"
            alignItems="center"
            background="white"
            borderRadius="xl"
            py="0"
            mx="0"
            my="auto"
            className="connect-button"
        >
            <Box px="3">
                <Text color="gray.400" fontSize="md">
                    {etherBalance &&
                        parseFloat(formatEther(etherBalance)).toFixed(3)}{' '}
                    ETH
                </Text>
            </Box>
            <Button
                onClick={handleOpenModal}
                bg="gray.400"
                border="1px solid transparent"
                _hover={{
                    border: '1px',
                    borderStyle: 'solid',
                    borderColor: 'blue.400',
                    backgroundColor: 'gray.500',
                }}
                borderRadius="xl"
                m="1px"
                px={3}
                height="38px"
            >
                <Text color="white" fontSize="md" fontWeight="medium" mr="2">
                    {sliceAccount(account)}
                </Text>
            </Button>
        </Box>
    ) : (
        <Button
            onClick={handleConnectWallet}
            mx="0"
            my="auto"
            bg="white"
            color="gray.500"
            fontSize="lg"
            fontWeight="medium"
            borderRadius="xl"
            border="1px solid transparent"
            _hover={{
                borderColor: 'gray.300',
                color: 'gray.600',
            }}
            _active={{
                borderColor: 'blue.100',
            }}
        >
            Connect to a wallet
        </Button>
    );
}
