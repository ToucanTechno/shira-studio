import {ChakraProvider, extendTheme} from "@chakra-ui/react";

export default function ChakraRTLProvider({ children }: any) {
    // TODO: support english website
    const direction = 'rtl';

    // 👇🏻 Here's the place we add direction to the theme
    const theme = extendTheme({ direction });

    return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}
