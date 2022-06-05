import { ReactNode } from 'react';
import { Flex } from '@chakra-ui/react';

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div>
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