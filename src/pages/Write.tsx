import { useContext, useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import {
    AspectRatio,
    Box,
    Button,
    Flex,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Spacer,
    Textarea,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import {
    Header,
    MintedText,
    MintStatusText,
    SubText,
} from '../components/Typography';
import ActionButton from '../components/ActionButton';
import { AppContext, Paper } from '../Router';
// import '@fontsource/inter';
import { textToArray, svgImageSrc, makeSVGFromString } from '../helpers/svg';
import useContract from '../hooks/useContract';

const Title = styled.div`
    color: #cacbcc;
    font-size: 34px;
    font-weight: 700;
    text-align: center;
`;

/**
 * Create a new on-chain document
 */
const Write = () => {
    const { getContract } = useContract();
    const [value, setValue] = useState('');
    const [amount, setAmount] = useState(10);
    const [pageName, setPageName] = useState('');
    const [miningStatusMsg, setMiningStatusMsg] = useState('');
    const [resultMsg, setResultMsg] = useState('');
    const { userPapers, appData, refetchAppData, refetchUserPapers } =
        useContext(AppContext);
    const [currentTokenId, setCurrentTokenId] = useState<string>();
    const MAX_LINES = 31; //Max lines in a single page
    const currentPaper = !!userPapers?.length
        ? userPapers.find(
              (paper: Paper) => paper.id === currentTokenId?.toString(),
          )
        : undefined;

    const handleWriteAction = async (): Promise<void> => {
        let valueArray = textToArray(value, MAX_LINES);
        const nftContract: any = await getContract();
        console.log('Contract: ' + nftContract, { proc: process.env });
        if (!nftContract) {
            console.error('Contract not (yet) available');
            return;
        }
        let nftTx = await nftContract.typewrite(
            Number(currentTokenId),
            pageName,
            valueArray,
        );
        setMiningStatusMsg(`Writing to blockchain....`);
        await nftTx.wait(2);
        refetchAppData();
        refetchUserPapers();
        setMiningStatusMsg('');
        setResultMsg(`Written!`);
        setValue('');
        setPageName('');
    };

    useEffect(() => {
        if (userPapers?.length === 1) {
            setCurrentTokenId('1');
        }
    }, [userPapers]);

    return (
        <Layout>
            <Header>The Typewriter</Header>
            {/* <MintedText>{appData?.numEdited || 0}/10000 written</MintedText> */}

            <Box maxWidth="550px">
                <Input
                    fontSize="14px"
                    marginTop="20px"
                    width="550px"
                    borderWidth="3px"
                    value={pageName}
                    _hover={{
                        borderColor: 'blue.100',
                    }}
                    _active={{
                        borderColor: 'blue.100',
                    }}
                    _focus={{
                        borderColor: 'blue.100',
                    }}
                    placeholder={'Title'}
                    onChange={(e: any) => setPageName(e.target.value)}
                />
                <AspectRatio
                    maxW="560px"
                    ratio={0.708}
                    sx={{
                        marginTop: '20px',
                        backgroundImage: 'url(/images/whitepaper.svg)',
                        backgroundSize: 'cover',
                    }}
                >
                    <Textarea
                        placeholder="Text"
                        value={value}
                        onChange={(e: any) => setValue(e.target.value)}
                        sx={{
                            width: '100%',
                            height: '93% !important',
                            color: 'gray.500',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 0,
                            fontSize: '14px',
                            whiteSpace: 'pre-wrap',
                        }}
                        _hover={{
                            borderColor: 'blue.100',
                        }}
                        _active={{
                            borderColor: 'blue.100',
                        }}
                        _focus={{
                            borderColor: 'blue.100',
                        }}
                    ></Textarea>
                </AspectRatio>
                <Box>
                    * Immutable: Once written, this paper can never be changed!
                </Box>

                <Flex marginBottom="40px" mt="6" textAlign="center">
                    <Box>
                        Preview
                        <img
                            width="200"
                            src={svgImageSrc(
                                makeSVGFromString(value, MAX_LINES),
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100px' }}>
                        <NumberInput
                            value={amount}
                            min={1}
                            onChange={(_: string, newAmount: number) =>
                                setAmount(newAmount)
                            }
                        >
                            <NumberInputField
                                borderColor="gray.300"
                                borderWidth="3px"
                                borderRadius="xl"
                                fontSize="lg"
                                variant="outline"
                                height={'45'}
                            />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </Box>
                    <Spacer />
                    <Box>
                        <Button
                            onClick={handleWriteAction}
                            width="280px"
                            height={'45'}
                            fontSize="lg"
                            fontWeight="bold"
                            borderColor="gray.300"
                            borderWidth="3px"
                            borderRadius="xl"
                            _hover={{
                                borderColor: 'blue.100',
                                color: 'blue.100',
                            }}
                            size="lg"
                            marginRight="20px"
                            variant="outline"
                            color="gray.400"
                        >
                            Write to the blockchain
                        </Button>
                    </Box>
                </Flex>
                {!!miningStatusMsg && (
                    <MintStatusText>{miningStatusMsg}</MintStatusText>
                )}
                {!!resultMsg && <SubText>{resultMsg}</SubText>}
            </Box>
        </Layout>
    );
};
export default Write;
