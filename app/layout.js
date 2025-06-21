"use client"

import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react"
import "@fontsource/orbitron"

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "#0a0f1c",
        color: "white",
        fontFamily: "Orbitron, sans-serif",
      },
    },
  },
  colors: {
    electric: {
      500: "#00FFFF",
    },
  },
  fonts: {
    heading: "Orbitron, sans-serif",
    body: "Orbitron, sans-serif",
  },
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </body>
    </html>
  )
}
