import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import Identicon from "./Identicon";

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
            <img src={`data:image/svg+xml;base64,${svg}`} />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
