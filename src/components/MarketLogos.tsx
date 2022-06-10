import React from 'react';
import { Image, Stack, Link } from "@chakra-ui/react";
import osLogo from '../media/opensea.png'; 
import rarLogo from '../media/looksrare.png'; 
import graphLogo from '../media/graph.png'; 
import twitterLogo from '../media/twitter.png'; 

type MarketLogosProps = {
  nftContractAddress: any;
};

export default function MarketLogos({ nftContractAddress }: MarketLogosProps) {
  return (
    <Stack
      marginTop={75}
      direction='row'
      width='100%'
      background="gray.200"
      px={6}
      py={6}
      justifyContent='space-evenly'>
      <Link isExternal href={`https://twitter.com/whitepaper_dao`}>
        <Image
          boxSize='50px'
          objectFit='cover'
          src={twitterLogo}
          alt='rar'
        />
      </Link>
      <Link
        href={`https://testnets.opensea.io/collection/whitepaper-zew70fojy4`}
        isExternal
      >
      <Image
        boxSize='50px'
        objectFit='cover'
        src={osLogo}
        alt='OpenSea'
      />
    </Link>
    <Link isExternal href={`https://thegraph.com/hosted-service/subgraph/paperdao/whitepaper`}>
      <Image
        boxSize='50px'
        objectFit='cover'
        src={graphLogo}
        alt='rar'
      />
    </Link>
  </Stack>
  )
};
