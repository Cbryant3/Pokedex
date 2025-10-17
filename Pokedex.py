from flask import Flask, jsonify, request
import requests

app = Flask(__name__)
base_url = "https://pokeapi.co/api/v2"

def get_pokemon_data(pokemon_name):
    url = f"{base_url}/pokemon/{pokemon_name.lower()}"
    response = requests.get(url)
    if response.status_code == 200:
        pokemon_data = response.json()
        return response.json()
    else:
        print(f"Error: Unable to fetch data for {pokemon_name} ({response.status_code})")
        return None


def display_pokemon_info(pokemon_name):
    pokemon_info = get_pokemon_data(pokemon_name)
   

    if not pokemon_info:
        print("Pokémon not found.")
        return
    
    if pokemon_info:
        print(f"\nName: {pokemon_info["name"].capitalize()}")


        print("\nSprites:")
        print(f"  Default: {pokemon_info['sprites']['front_default']}")
        print(f"  Shiny: {pokemon_info['sprites']['front_shiny']}\n")

        print("Official Artwork:")
        print(f"  Default: {pokemon_info['sprites']['other']['official-artwork']['front_default']}")
        print(f"  Shiny: {pokemon_info['sprites']['other']['official-artwork']['front_shiny']}\n")

        cry_url = f"https://play.pokemonshowdown.com/audio/cries/{pokemon_name.lower()}.mp3"
        print(f"\nCry: {cry_url}\n")

        print(f"No: {pokemon_info["id"]}")
        print(f"Height: {pokemon_info["height"]} m")
        print(f"Weight: {pokemon_info["weight"]} kg")

        abilties = [ability["ability"]["name"] for ability in pokemon_info["abilities"]]
        print(f"Abilities: {' , '.join(abilties)}")

        types = [t['type']['name'] for t in pokemon_info['types']]
        print(f"Type(s): {', '.join(types)}")

        moves = [move['move']['name'] for move in pokemon_info['moves']]
        print("\nMoves:")
        print("  " + ", ".join(moves[:20]) + ("..." if len(moves) > 10 else ""))

        print("\nStats:")
        for stat in pokemon_info['stats']:
            print(f"  {stat['stat']['name'].capitalize()}: {stat['base_stat']}")

        


# Example usage
if __name__ == "__main__":
    pokemon_name = input("Enter a Pokémon name: ")
    display_pokemon_info(pokemon_name)