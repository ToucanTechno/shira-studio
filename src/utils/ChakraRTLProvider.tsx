import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import { ReactNode } from "react";

export default function ChakraRTLProvider({ children }: { children: ReactNode }) {
    // TODO: support english website
    const direction = 'rtl';

    // 👇🏻 Here's the place we add direction to the theme
    const theme = extendTheme({ direction });

    return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}
