import React from 'react';
import {
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import { SubText } from '../components/Typography';

export default function Prices() {
  return (
    <Box mt={4}>
      <SimpleGrid columns={2} gap={10}>
        <Box pr={5}>
          <SubText>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 – 1000 – Free mint + gas<br/>
            1001 – 2000 – 1.0 MATIC + gas<br/>
            2001 – 3000 – 2.0 MATIC + gas<br/>
            3001 – 4000 – 3.0 MATIC + gas<br/>
            &nbsp;4001 – 5000 – 4.0 MATIC + gas<br/>
          </SubText>
        </Box>
        <Box pl={5}>
          <SubText>
            5001 – 6000 – 5.0 MATIC + gas<br/>
            6001 – 7000 – 6.0 MATIC + gas<br/>
            7001 – 8000 – 7.0 MATIC + gas<br/>
            8001 – 9000 – 8.0 MATIC + gas<br/>
            &nbsp;9001 – 10000 – 9.0 MATIC + gas<br/>
          </SubText>
        </Box>
      </SimpleGrid>
    </Box>
  )
};
