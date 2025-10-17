from flask import Flask, jsonify, request, render_template
import requests

app = Flask(__name__)
base_url = "https://pokeapi.co/api/v2"

@app.route("/")
def home():
    return render_template("index.html")

def get_pokemon_data(pokemon_name):
    url = f"{base_url}/pokemon/{pokemon_name.lower()}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

@app.route("/api/pokemon/<pokemon_name>", methods=["GET"])
def display_pokemon_info(pokemon_name):
    pokemon_info = get_pokemon_data(pokemon_name)

    if not pokemon_info:
        return jsonify({"error": "Pokémon not found."}), 404

    # Build JSON-serializable fields
    abilities = [ability["ability"]["name"] for ability in pokemon_info.get("abilities", [])]
    types = [t["type"]["name"] for t in pokemon_info.get("types", [])]
    sprites = {
        "default": pokemon_info.get("sprites", {}).get("front_default"),
        "shiny": pokemon_info.get("sprites", {}).get("front_shiny"),
    }
    official_artwork = {
        "default": pokemon_info.get("sprites", {}).get("other", {}).get("official-artwork", {}).get("front_default"),
        "shiny": pokemon_info.get("sprites", {}).get("other", {}).get("official-artwork", {}).get("front_shiny"),
    }
    moves = [move["move"]["name"] for move in pokemon_info.get("moves", [])]
    stats = {stat["stat"]["name"]: stat["base_stat"] for stat in pokemon_info.get("stats", [])}

    data = {
        "name": pokemon_info.get("name", "").capitalize(),
        "id": pokemon_info.get("id"),
        "height": pokemon_info.get("height"),
        "weight": pokemon_info.get("weight"),
        "abilities": abilities,
        "types": types,
        "sprites": sprites,
        "official_artwork": official_artwork,
        "cry": f"https://play.pokemonshowdown.com/audio/cries/{pokemon_name.lower()}.mp3",
        "moves": moves,
        "stats": stats,
    }

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)