"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface PokemonResult {
  name: string;
  url: string;
}

interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonResult[];
}

export default function Page() {
  const [pokemons, setPokemons] = useState<PokemonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const limit = 10; // Number of Pokémon per page

  const fetchPokemons = async (page: number) => {
    const offset = (page - 1) * limit;

    try {
      const response = await axios.get<PokemonResponse>(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      setPokemons(response.data);
      // Calculate total pages based on count
      setTotalPages(Math.ceil(response.data.count / limit));
    } catch (err) {
      console.error("Error fetching Pokémon:", err);
      setError("Failed to fetch Pokémon data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons(page);
  }, [page]);

  if (loading) return <p className="container mx-auto mt-10">Loading...</p>;
  if (error) return <p className="container mx-auto mt-10">{error}</p>;

  if (!pokemons) return <p>No Pokémon data available</p>;

  return (
    <div className="container">
      <div className="max-w-5xl">
        <h1 className="mt-10 mb-3 text-3xl font-bold">Pokémon List</h1>
        <ul className="flex flex-col gap-2">
          {pokemons.results.map((pokemon) => (
            <li key={pokemon.name}>
              <Link
                href={`pokemon/${pokemon.name}`}
                className="text-blue-500 hover:underline"
              >
                {pokemon.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-green-500 rounded px-4 py-2"
          >
            Previous
          </button>
          <span className="self-center">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="bg-green-500 rounded px-4 py-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}