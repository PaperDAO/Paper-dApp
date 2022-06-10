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
import { Link as ReachLink } from "react-router-dom"
import { AppContext } from "../Router";
import Icon from './Icon';
import closeIcon from '../media/close.svg';
import menuIcon from '../media/menu.svg';

type Props = {
  children?: ReactNode;
};

type TNavLink = {
  label: string,
  link: string,
  isVisible: boolean
}
const NavLink = (
  {
    label,
    link,
    isVisible,
  }: TNavLink
) => isVisible ? (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={link}>
      {label}
  </Link>
): null;

export default function Layout({ children }: Props) {
  const { userPapers } = useContext(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.100', 'gray.400');

  const Links = [
    {
      label: 'Mint',
      link: '/',
      isVisible: true,
    }, 
    {
      label: 'Typewriter',
      link: '/editor',
      isVisible: !!userPapers?.length,
    }, 
    {
      label: 'Collection',
      link: '/collection',
      isVisible: true,
    }, 
  ];

  const renderLinks = Links.map(({ link, label, isVisible }) => (
    <NavLink key={label} label={label} link={link} isVisible={isVisible} />
  ));

  const renderNavBar = (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <Icon svg={closeIcon} /> : <Icon svg={menuIcon} />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box>
            <Text color="gray.400" fontWeight="600">
              WhitePaperDAO
            </Text>
          </Box>
          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}>
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
    </Box>
  );

  return (
    <div>
      {renderNavBar}
      <Flex
        paddingTop="40px"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        paddingBottom="50px"
      >
      {children}
    </Flex>
  </div>
  );
}