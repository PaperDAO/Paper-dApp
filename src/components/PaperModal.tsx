import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  Link,
} from "@chakra-ui/react";
import { SubTextLf, SubTextLfSm } from "./Typography";

type Props = {
  isOpen: any;
  onClose: any;
  svg: any;
  data: any;
};

export default function PaperModal({ isOpen, data, onClose, svg }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent width="500px">
        <ModalHeader>
          <Link
            fontSize="sm"
            display="flex"
            href={`https://ropsten.etherscan.io/address/${data?.owner}`}
            isExternal
            color="gray.400"
            _hover={{
              color: "gray.300",
              textDecoration: "underline",
            }}
          >
            View on Explorer
          </Link>
          <SubTextLf>{data?.owner}</SubTextLf>
          <SubTextLfSm>{data?.paperTitle}</SubTextLfSm>
          </ModalHeader>
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