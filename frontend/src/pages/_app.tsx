import '@/styles/globals.css';
import type { AppProps } from 'next/app';
// 1. import `NextUIProvider` component
import { Button, NextUIProvider } from '@nextui-org/react';
import Navbar from '@/components/Navbar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider className="w-screen">
      <Navbar/>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}