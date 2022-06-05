import {ReactNode, useContext} from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { Link as ReachLink } from "react-router-dom"
import {AppContext} from "../Router";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {

    const {userPapers} = useContext(AppContext);

    const bgColor =useColorModeValue('gray.100', 'gray.400');
  return (
    <div>
       <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Box><Text color="gray.400" fontWeight="600">WhitePaperDAO</Text></Box>
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
                  bg: bgColor,
                }}
                as={ReachLink}
                to='/'>
                  <Text color="gray.500" fontWeight="bold">
                    Mint
                  </Text>
              </Link>
                {(userPapers?.length) && (<Link
                px={2}
                py={1}
                rounded={'md'}
                _hover={{
                  textDecoration: 'none',
                  bg: bgColor,
                }}
                as={ReachLink}
                to='/editor'>
                <Text color="gray.500" fontWeight="bold">
                  Editor
                </Text>
              </Link>) }
              <Link
                px={2}
                py={1}
                rounded={'md'}
                _hover={{
                  textDecoration: 'none',
                  bg: bgColor,
                }}
                as={ReachLink}
                to='/collection'>
                  <Text color="gray.500" fontWeight="bold">
                    Collection
                  </Text>
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
        paddingBottom="50px"
        // h="100vh"
      >
      {children}
    </Flex>
  </div>
  );
}