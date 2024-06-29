import '@/styles/globals.css';
import type { AppProps } from 'next/app';
// 1. import `NextUIProvider` component
import { Button, NextUIProvider } from '@nextui-org/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider className={"h-screen"}>
      <div className={"fixed"}><Button color='primary'>Hello World</Button></div>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}