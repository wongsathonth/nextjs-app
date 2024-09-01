// app/pokemon/[name]/page.tsx

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface PokemonDetails {
    name: string;
    height: number;
    weight: number;
    sprites: {
        front_default: string;
    };
    types: {
        type: {
            name: string;
        };
    }[];
}

export default function PokemonPage({ params }: { params: { name: string } }) {
    const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params.name) {
            const fetchPokemonDetails = async () => {
                try {
                    const response = await axios.get<PokemonDetails>(
                        `https://pokeapi.co/api/v2/pokemon/${params.name}`
                    );
                    setPokemon(response.data);
                } catch (err) {
                    console.error("Error fetching Pokémon details:", err);
                    setError("Failed to fetch Pokémon details");
                } finally {
                    setLoading(false);
                }
            };

            fetchPokemonDetails();
        }
    }, [params.name]);

    if (loading) return <p className="container mx-auto mt-10">Loading...</p>;
    if (error) return <p className="container mx-auto mt-10">{error}</p>;

    if (!pokemon) return <p>No Pokémon data available</p>;

    return (
        <div className="container">
            <div className="max-w-5xl">
                <h1 className="mt-10 mb-3 text-3xl font-bold">{pokemon.name}</h1>
                <Image
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    width={100}
                    height={150}
                />
                <p>Height: {pokemon.height / 10} m</p>
                <p>Weight: {pokemon.weight / 10} kg</p>
                <p>Type(s): {pokemon.types.map((type) => type.type.name).join(", ")}</p>
            </div>
        </div>
    );
}