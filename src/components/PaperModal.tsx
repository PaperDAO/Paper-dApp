import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react";

type Props = {
  isOpen: any;
  onClose: any;
  svg: any;
};

export default function PaperModal({ isOpen, onClose, svg }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Flex justifyContent="space-between" alignItems="center">
            <div>
              <img src={`data:image/svg+xml;base64,${svg}`} />
            </div>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}