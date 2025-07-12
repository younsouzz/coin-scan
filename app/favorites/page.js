"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  IconButton,
  Button,
  VStack,
} from "@chakra-ui/react"
import { DeleteIcon } from "@chakra-ui/icons"
import Link from "next/link"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem("favorites")
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  const removeFromFavorites = (id) => {
    const updated = favorites.filter((coin) => coin.id !== id)
    setFavorites(updated)
    localStorage.setItem("favorites", JSON.stringify(updated))
  }

  return (
    <Box p={6}>
      <VStack spacing={4} mb={8}>
        <Heading size="xl" color="electric.500">
          Your Favorite Cryptos
        </Heading>
        <Link href="/">
          <Button variant="outline" colorScheme="electric">
            ⬅ Back to Home
          </Button>
        </Link>
      </VStack>

      {favorites.length === 0 ? (
        <Text fontSize="lg" color="gray.400" textAlign="center">
          You haven’t added any favorites yet.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {favorites.map((coin) => (
            <Box
              key={coin.id}
              p={5}
              borderWidth="1px"
              borderRadius="xl"
              bg="#111827"
              boxShadow="md"
              position="relative"
            >
              <Image
                src={coin.image}
                alt={coin.name}
                boxSize="50px"
                mb={3}
                mx="auto"
              />
              <Heading size="md" textAlign="center">
                {coin.name}
              </Heading>
              <Text mt={2} textAlign="center">
                Price: ${coin.current_price.toLocaleString()}
              </Text>

              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                variant="ghost"
                aria-label="Remove from favorites"
                position="absolute"
                top={2}
                right={2}
                onClick={() => removeFromFavorites(coin.id)}
              />
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}
