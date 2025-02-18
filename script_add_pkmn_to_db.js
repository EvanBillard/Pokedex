const typeTranslation = {
    "normal": "Normal",
    "fire": "Feu",
    "water": "Eau",
    "grass": "Plante",
    "electric": "Électrique",
    "ice": "Glace",
    "fighting": "Combat",
    "poison": "Poison",
    "ground": "Sol",
    "flying": "Vol",
    "psychic": "Psy",
    "bug": "Insecte",
    "rock": "Roche",
    "ghost": "Spectre",
    "dragon": "Dragon",
    "dark": "Ténèbres",
    "steel": "Acier",
    "fairy": "Fée"
};

for (let i = 0; i < 1025; i++) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`)
        .then(response => response.json())
        .then(data => {
            // Remplacer les types en anglais par leurs équivalents français
            const types = data.types.map(type => typeTranslation[type.type.name] || type.type.name);
            const imgUrl = data.sprites.front_default;
            let description;
            let name;
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${i + 1}`)
                .then(response => response.json())
                .then(data2 => {
                    description = data2.flavor_text_entries.find(entry => entry.language.name === 'fr').flavor_text;
                    name = data2.names.find(entry => entry.language.name === 'fr').name;
                    const game_indices = data.game_indices;
                    const regions = {
                        'red': 'Kanto',
                        'blue': 'Kanto',
                        'yellow': 'Kanto',
                        'gold': 'Johto',
                        'silver': 'Johto',
                        'crystal': 'Johto',
                        'ruby': 'Hoenn',
                        'sapphire': 'Hoenn',
                        'emerald': 'Hoenn',
                        'firered': 'Kanto',
                        'leafgreen': 'Kanto',
                        'diamond': 'Sinnoh',
                        'pearl': 'Sinnoh',
                        'platinum': 'Sinnoh',
                        'heartgold': 'Johto',
                        'soulsilver': 'Johto',
                        'black': 'Unova',
                        'white': 'Unova',
                        'black-2': 'Unova',
                        'white-2': 'Unova',
                        'x': 'Kalos',
                        'y': 'Kalos',
                        'omega-ruby': 'Hoenn',
                        'alpha-sapphire': 'Hoenn',
                        'sun': 'Alola',
                        'moon': 'Alola',
                        'ultra-sun': 'Alola',
                        'ultra-moon': 'Alola',
                        'let\'s-go-pikachu': 'Kanto',
                        'let\'s-go-eevee': 'Kanto',
                        'sword': 'Galar',
                        'shield': 'Galar',
                        'brilliant-diamond': 'Sinnoh',
                        'shining-pearl': 'Sinnoh',
                        'legends-arceus': 'Hisui',
                        'scarlet': 'Paldea',
                        'violet': 'Paldea'
                    };

                    const gameRegions = game_indices.map(game => regions[game.version.name] || 'Unknown');
                    const uniqueRegions = [...new Set(gameRegions)];
                    const regionName = uniqueRegions.map(region => {
                        const gameIndex = game_indices.find(game => regions[game.version.name] === region).game_index;
                        return { regionName: region, regionPokedexNumber: gameIndex };
                    });
                    const soundPath = data.cries.latest;


                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2FlZmFiYTBhYzBmZTVlNGRlYWZkZGUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Mzk4NjcxMTksImV4cCI6MTczOTg3MDcxOX0.pg5Xk9HBHcI5yG7cuqREWXWngNxk9YwYjp35JO0J6Ic");

                    const raw = JSON.stringify({
                        "name": name,
                        "types": types,
                        "imgUrl": imgUrl,
                        "description": description,
                        "regions": regionName,
                        "soundPath": soundPath
                    });

                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow"
                    };

                    fetch("http://localhost:3000/api/pokemon", requestOptions)
                        .then((response) => response.text())
                        .then((result) => console.log(result))
                        .catch((error) => console.error(error));
                })
                .catch(error => console.error(error))
        })
        .catch(error => console.error(error))
}
