import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import { Landing } from "./pages";
import ConnectButton from "./components/ConnectButton";
import AccountModal from "./components/AccountModal";
import AppRoutes from './Router';
import "@fontsource/inter";

function App() {
  return (
      <AppRoutes />
  );
}

export default App;
