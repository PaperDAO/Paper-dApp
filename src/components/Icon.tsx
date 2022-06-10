import React from 'react';
import { Button, Text } from "@chakra-ui/react";

type IconProps = {
  svg: any;
};

export default function Icon({
  svg
}: IconProps) {
  return <img src={svg} />
};
