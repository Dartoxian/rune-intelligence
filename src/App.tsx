import * as React from "react";
import { ChakraProvider, Box, Flex, extendTheme, Text } from "@chakra-ui/react";

import { DeckProvider } from "./DeckProvider";
import { CardGrid } from "./components/CardGrid";
import { DeckSummary } from "./components/DeckSummary";
import Fonts from "./fonts";
import { Destiny } from "./components/Destiny";

const runeTheme = extendTheme({
  fonts: {
    heading: `'Almendra', serif`,
    body: `'Almendra', serif`,
  },
  config: {
    initialColorMode: "dark",
  },
});

export const App = () => (
  <ChakraProvider theme={runeTheme}>
    <Fonts />
    <DeckProvider>
      <Flex flexDirection={"column"} p={"1rem"} h={"100vh"}>
        <Box fontSize={"lg"} textAlign={"center"}>
          Runewars Intelligence Platform
        </Box>
        <Flex flexDirection={"column"} flex={"1"}>
          <Flex flex={"1"}>
            <Box flex={"1"}></Box>
            <Destiny />
          </Flex>
          <Flex flexDirection={"row"}>
            <Box flex={"1"}>
              <DeckSummary />
            </Box>
            <Box flex={"3"}>
              <CardGrid />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </DeckProvider>
  </ChakraProvider>
);
