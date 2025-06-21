"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

async function fetchCoins() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
  )
  if (!res.ok) throw new Error("Failed to fetch coins")
  return res.json()
}

export default function Home() {
  const [coins, setCoins] = useState([])
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    fetchCoins().then(setCoins).catch(console.error)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
  }, [favorites])

  function toggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  return (
    <main
      style={{
        padding: 24,
        maxWidth: 800,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "flex-start",
        backgroundColor: "#0a0f1c",
      }}
    >
      <h1
        style={{
          color: "#00FFFF",
          fontFamily: "Orbitron, sans-serif",
          fontSize: "4rem",
          textAlign: "center",
          marginTop: 0,
          marginBottom: 40,
        }}
      >
        Coin Scan
      </h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {coins.map((coin) => {
          const isFav = favorites.includes(coin.id)
          return (
            <li
              key={coin.id}
              onClick={() => toggleFavorite(coin.id)}
              style={{
                backgroundColor: "#121827",
                margin: "16px 0",
                borderRadius: 12,
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 16,
                cursor: "pointer",
                border: isFav ? "2px solid #00FFFF" : "2px solid transparent",
                userSelect: "none",
              }}
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <Image
                src={coin.image}
                alt={coin.name}
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
              />
              <div style={{ flex: 1 }}>
                <strong>{coin.name}</strong> ({coin.symbol.toUpperCase()})
              </div>
              <div style={{ color: "#00FFFF", fontWeight: "bold" }}>
                ${coin.current_price.toLocaleString()}
              </div>
              <div
                style={{
                  color: isFav ? "#00FFFF" : "#555",
                  fontSize: "1.5rem",
                  marginLeft: 12,
                }}
              >
                {isFav ? "★" : "☆"}
              </div>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
