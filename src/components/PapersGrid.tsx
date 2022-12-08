import { Box, SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';
import { svgImageSrc } from '../helpers/svg';
import usePapers from '../hooks/usePapers';
import PaperModal from './PaperModal';
import { SubTextLfSm } from './Typography';

export default function PapersGrid({
    first = 12,
    skip = 0,
    children,
}: any): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSvg, setSelectedSvg] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const { isLoading, papers } = usePapers(first);

    const onClose = () => setIsOpen(false);
    const onModalOpen = (item: any, svg: any) => {
        setSelectedItem(item);
        setSelectedSvg(svg);
        setIsOpen(true);
    };

    return (
        <Box padding="30px">
            {!isLoading && !!papers && (
                <SimpleGrid columns={[1, 2, 3, 4, 5]} gap={4}>
                    {papers?.map(
                        (
                            item: {
                                metadata: any;
                                owner: string;
                                paperTitle: string;
                            },
                            index: any,
                        ) => {
                            if (item?.metadata.image_data) {
                                const buff = Buffer.from(
                                    item?.metadata.image_data,
                                );
                                const base64data = buff.toString('base64');
                                const image = (
                                    <img
                                        src={svgImageSrc(
                                            item?.metadata.image_data,
                                        )}
                                    />
                                );
                                return (
                                    <Box
                                        key={index}
                                        // minWidth="250px"
                                        pt={2}
                                        onClick={() =>
                                            onModalOpen(item, base64data)
                                        }
                                    >
                                        <Box cursor="pointer">
                                            <SubTextLfSm>
                                                {item?.paperTitle ||
                                                    '[no title]'}
                                            </SubTextLfSm>
                                        </Box>
                                        {image}
                                        {/* <SubTextLfSm>
                                            {sliceAccount(item.owner)}
                                        </SubTextLfSm> */}
                                    </Box>
                                );
                            }
                        },
                    )}
                    {children}
                </SimpleGrid>
            )}
            <PaperModal
                onClose={onClose}
                isOpen={isOpen}
                data={selectedItem}
                svg={selectedSvg}
            />
        </Box>
    );
}
