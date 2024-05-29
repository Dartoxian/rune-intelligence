import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme, Flex,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Flex flexDirection={"column"}>
      <Box fontSize={"xl"}>Runeware Intelligence Platform</Box>
      <Box flex={"1"}>blep</Box>
    </Flex>
  </ChakraProvider>
)
