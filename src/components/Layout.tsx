import { ReactNode } from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as ReachLink } from "react-router-dom"

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div>
       <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Box>WhitePaperDao</Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              <Link
                px={2}
                py={1}
                rounded={'md'}
                _hover={{
                  textDecoration: 'none',
                  bg: useColorModeValue('gray.100', 'gray.400'),
                }}
                as={ReachLink}
                to='/'>
                  Mint
              </Link>
              <Link
                px={2}
                py={1}
                rounded={'md'}
                _hover={{
                  textDecoration: 'none',
                  bg: useColorModeValue('gray.100', 'gray.400'),
                }}
                as={ReachLink}
                to='/editor'>
                Editor
              </Link>
              <Link
                px={2}
                py={1}
                rounded={'md'}
                _hover={{
                  textDecoration: 'none',
                  bg: useColorModeValue('gray.100', 'gray.400'),
                }}
                as={ReachLink}
                to='/collection'>
                  Collection
              </Link>
            </HStack>
          </HStack>
        </Flex>
      </Box>
      <Flex
        paddingTop="40px"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        // h="100vh"
      >
      {children}
    </Flex>
  </div>
  );
}