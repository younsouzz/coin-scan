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
        padding: "40px 20px",
        maxWidth: 1000,
        margin: "0 auto",
        backgroundColor: "#0a0f1c",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          color: "#00FFFF",
          fontFamily: "Orbitron, sans-serif",
          fontSize: "3rem",
          textAlign: "center",
          marginBottom: "50px",
        }}
      >
        Coin Scan
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
        }}
      >
        {coins.map((coin) => {
          const isFav = favorites.includes(coin.id)
          return (
            <div
              key={coin.id}
              onClick={() => toggleFavorite(coin.id)}
              style={{
                backgroundColor: "#121827",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                border: isFav ? "2px solid #00FFFF" : "2px solid transparent",
                transition: "all 0.2s ease",
                boxShadow: "0 0 0 transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 15px rgba(0,255,255,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 transparent"
              }}
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <Image
                src={coin.image}
                alt={coin.name}
                width={64}
                height={64}
                style={{ borderRadius: "50%" }}
              />
              <h2
                style={{
                  color: "white",
                  margin: "16px 0 4px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {coin.name}
              </h2>
              <p
                style={{
                  color: "#888",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  fontSize: "0.9rem",
                }}
              >
                {coin.symbol}
              </p>
              <p
                style={{
                  color: "#00FFFF",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  marginBottom: "12px",
                }}
              >
                ${coin.current_price.toLocaleString()}
              </p>
              <div
                style={{
                  fontSize: "2rem",
                  color: isFav ? "#00FFFF" : "#333",
                }}
              >
                {isFav ? "★" : "☆"}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
