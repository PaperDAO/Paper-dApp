<<<<<<< HEAD
import React from "react";
=======
import React from 'react';
>>>>>>> more logic
import AppRoutes from './Router';
import "@fontsource/inter";
import { QueryClient, QueryClientProvider } from "react-query";

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

        <AppRoutes />
      </QueryClientProvider>

  );
}

export default App;
