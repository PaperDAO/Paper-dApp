import { ReactNode, useContext, useState } from 'react';
import {
    Box,
    Flex,
    HStack,
    Stack,
    Link,
    useColorModeValue,
    Text,
    IconButton,
    useDisclosure,
} from '@chakra-ui/react';
import { AppContext } from '../Router';
import Icon from './Icon';
import ConnectButton from '../components/ConnectButton';
import closeIcon from '../media/close.svg';
import menuIcon from '../media/menu.svg';
import MarketLogos from '../components/MarketLogos';
import NavLink from './NavLink';

type Props = {
    children?: ReactNode;
};

export default function Layout({ children }: Props) {
    const { userPapers } = useContext(AppContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    // const bgColor = useColorModeValue('gray.100', 'gray.400');

    const Links = [
        {
            label: 'Mint',
            link: '/',
            isVisible: true,
        },
        {
            label: 'Collection',
            link: '/collection',
            isVisible: true,
        },
        {
            label: 'Typewriter',
            link: '/editor',
            isVisible: !!userPapers?.length,
        },
        {
            label: 'Write',
            link: '/write',
            isVisible: true,
        },
    ];

    const renderLinks = Links.map(({ link, label, isVisible }) => (
        <NavLink key={label} label={label} link={link} isVisible={isVisible} />
    ));

    const renderNavBar = (
        <Box
            bg={useColorModeValue('gray.100', 'gray.900')}
            px={4}
            display="flex"
            justifyContent="space-between"
        >
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <IconButton
                    size={'md'}
                    icon={
                        isOpen ? (
                            <Icon svg={closeIcon} />
                        ) : (
                            <Icon svg={menuIcon} />
                        )
                    }
                    aria-label={'Open Menu'}
                    display={{ md: 'none' }}
                    onClick={isOpen ? onClose : onOpen}
                />
                <HStack spacing={8} alignItems={'center'}>
                    <Box>
                        <Text color="gray.400" fontWeight="600">
                            <Link href={'/'}>WhitePaperDAO</Link>
                        </Text>
                    </Box>
                    <HStack
                        as={'nav'}
                        spacing={4}
                        display={{ base: 'none', md: 'flex' }}
                    >
                        {renderLinks}
                    </HStack>
                </HStack>
            </Flex>

            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as={'nav'} spacing={4}>
                        {renderLinks}
                    </Stack>
                </Box>
            ) : null}

            <ConnectButton />
        </Box>
    );

    return (
        <div>
            <Flex
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
                paddingBottom="0px"
                minHeight="100vh"
            >
                <Box width="100%">{renderNavBar}</Box>
                <Box>{children}</Box>
                <MarketLogos
                    nftContractAddress={process.env.REACT_APP_CONTRACT_ADDRESS}
                />
            </Flex>
        </div>
    );
}
