import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import { Button, NextUIProvider } from '@nextui-org/react';
import Navbar from '@/components/Navbar';
import {Box, createTheme, ThemeProvider} from "@mui/material";

export default function App({ Component, pageProps }: AppProps) {

    const theme = createTheme({
        palette: {
            mode: 'light'  // Ensures that the light mode is activated
        },
    });

  return (
      <ThemeProvider theme={theme}>
          <NextUIProvider className="w-screen">
            <Navbar/>
            <Box className={"h-[calc(100vh-64px)] bg-neutral-100 overflow-y-scroll"}>
              <Component {...pageProps} />
            </Box>
          </NextUIProvider>
      </ThemeProvider>
  );
}