import React from "react";
import AppRoutes from './Router';
import "@fontsource/inter";
import { QueryClient, QueryClientProvider } from "react-query";
import theme from "./theme";
import { ChakraProvider } from "@chakra-ui/react";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});


function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
        <AppRoutes />
        </ChakraProvider>
      </QueryClientProvider>

  );
}

export default App;
