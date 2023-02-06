import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { SessionProvider } from "next-auth/react"
import { store } from '../redux/store';
import LayoutMain from '../components/Layouts/LayoutMain';
import { ChakraProvider } from '@chakra-ui/react';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <ChakraProvider>
          <LayoutMain> 
            <Component {...pageProps} /> 
          </LayoutMain>
        </ChakraProvider>
      </SessionProvider>
    </Provider >
  )
}

export default MyApp
