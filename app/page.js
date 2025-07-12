"use client";

import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  useToast,
  IconButton,
  SimpleGrid,
  Flex,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { StarIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 10,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoins(res.data);

        // Load existing favorites from localStorage
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCoins();
  }, []);

  const toggleFavorite = (coinId) => {
    let updatedFavorites;

    const existing = favorites.find((fav) => fav.id === coinId);
    const selectedCoin = coins.find((coin) => coin.id === coinId);

    if (existing) {
      updatedFavorites = favorites.filter((fav) => fav.id !== coinId);
      toast({
        title: "Removed from favorites",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } else {
      updatedFavorites = [...favorites, selectedCoin];
      toast({
        title: "Added to favorites",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const isFavorite = (coinId) => {
    return favorites.some((fav) => fav.id === coinId);
  };

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading
          fontSize="4xl"
          color="electric.500"
          fontFamily="Orbitron, sans-serif"
        >
          Coin Scan
        </Heading>

        <Flex gap={2}>
          <Link href="/favorites">
            <Button colorScheme="electric" variant="outline">
              ⭐ Favorites
            </Button>
          </Link>

          <IconButton
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="outline"
            aria-label="Toggle color mode"
          />
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {coins.map((coin) => (
          <Box
            key={coin.id}
            borderWidth="1px"
            borderRadius="2xl"
            p={5}
            bg={isFavorite(coin.id) ? "gray.700" : "gray.800"}
            boxShadow="xl"
            _hover={{ transform: "scale(1.02)" }}
            transition="all 0.3s"
          >
            <Flex justify="space-between" align="center" mb={3}>
              <Image
                src={coin.image}
                alt={coin.name}
                boxSize="40px"
                borderRadius="full"
              />
              <IconButton
                icon={<StarIcon />}
                colorScheme={isFavorite(coin.id) ? "yellow" : "gray"}
                variant={isFavorite(coin.id) ? "solid" : "outline"}
                onClick={() => toggleFavorite(coin.id)}
                aria-label="Toggle Favorite"
              />
            </Flex>
            <Text fontSize="xl" fontWeight="bold" color="white">
              {coin.name}
            </Text>
            <Text color="gray.300">${coin.current_price.toLocaleString()}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
