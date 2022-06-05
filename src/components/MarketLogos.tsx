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
      width={400}
      background="gray.200"
      px={6}
      py={2}
      justifyContent='space-evenly'>
      <Link
        href={`https://opensea.io//collection/${nftContractAddress}`}
        isExternal
      >
      <Image
        boxSize='50px'
        objectFit='cover'
        src={osLogo}
        alt='OpenSea'
      />
    </Link>
    <Link
      isExternal
      href={`https://looksrare.org/collection/${nftContractAddress}`}
    >
      <Image
        boxSize='50px'
        objectFit='cover'
        src={rarLogo}
        alt='rar'
      />
    </Link>
    <Link
      isExternal
      href={`https://twitter.com/whitepaper_dao`}
    >
      <Image
        boxSize='50px'
        objectFit='cover'
        src={twitterLogo}
        alt='rar'
      />
    </Link>
    <Link
      isExternal
      href={`https://thegraph.com`}
    >
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
