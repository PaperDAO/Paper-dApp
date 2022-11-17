import React from 'react';
import { Button, Text } from '@chakra-ui/react';

type ActionButtonProps = {
    handleAction?: any;
    text: string;
    width?: string;
};

export default function ActionButton({
    handleAction,
    text,
    width = '200px',
}: ActionButtonProps) {
    return (
        <Button
            onClick={handleAction ? handleAction : () => {}}
            fontSize="lg"
            fontWeight="bold"
            borderWidth="3px"
            borderRadius="xl"
            border="2px solid transparent"
            _hover={{
                borderColor: 'blue.100',
                color: 'blue.100',
            }}
            size="lg"
            marginRight="20px"
            variant="outline"
            width={width}
            color="gray.400"
            borderColor="gray.300"
        >
            {text}
        </Button>
    );
}
