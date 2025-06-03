"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    fetchpokemon();
    console.log("Website Werd geladen");

    const form = document.getElementById('pokemon-form');
    const formWrapper = document.getElementById('form-wrapper');
    const openFormBtn = document.getElementById('open-form');

    openFormBtn.addEventListener('click', () => {
        formWrapper.classList.remove('hidden');
        form.scrollIntoView({ behavior: 'smooth' });
    });

    form.addEventListener('submit', handleFormSubmit);

    typing();
}

function fetchpokemon() {
    fetch("http://localhost:3333/pokemon/")
        .then(res => res.json())
        .then(data => {
            const sorted = data.sort((a, b) => a.id - b.id);
            showPokemon(sorted);
        })
        .catch(error => console.log("Fout bij ophalen van Pokémon:", error));
}

async function fetchSprite(name, elementId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        const data = await response.json();
        const spriteUrl = data.sprites.versions["generation-viii"].icons.front_default;

        if (spriteUrl) {
            document.getElementById(elementId).src = spriteUrl;
        } else {
            console.warn(`Geen sprite gevonden voor ${name}`);
        }
    } catch (error) {
        console.error(`Fout bij ophalen sprite voor ${name}:`, error);
    }
}

function showPokemon(pokemonList) {
    const list = document.getElementById("pokemonGroup");
    list.innerHTML = "";

    pokemonList.forEach(pokemon => {
        const typeClass = `type-${pokemon.type}`;
        const row = document.createElement("tr");
        const spriteId = `sprite-${pokemon.id}`;

        row.innerHTML = `
            <section class="Pokedex">
                <td>${pokemon.id}</td>
                <td><img id="${spriteId}" src="assets/img/placeholder.png" height="50" width="50" alt="Deze werd niet gevonden"/></td>
                <td>${pokemon.name}</td>
                <td><span class="${typeClass}">${pokemon.type}</span></td>
                <td> <img src="assets/img/SmallX.png" height="37" width="50" alt="Dyna"/></td>
                <td>${pokemon.gigantamax}</td>
                <td><button class="et-btn" data-id="${pokemon.id}">Bewerk</button></td> 
                <td><button class="dlt-btn" data-id="${pokemon.id}">Verwijder</button></td>
            </section>
        `;
        list.appendChild(row);

        fetchSprite(pokemon.name, spriteId);

        row.querySelector(".et-btn").addEventListener("click", () => editpokemon(pokemon.id));
        row.querySelector(".dlt-btn").addEventListener("click", () => deletepokemon(pokemon.id));
    });
}

function typing() {
    try {
        const types = [
            "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting",
            "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost",
            "Dragon", "Dark", "Steel", "Fairy"
        ];

        const paragraph = document.getElementById("beschrijving");
        const typeRegex = new RegExp(`\\b(${types.join("|")})\\b`, "g");

        if (paragraph) {
            paragraph.innerHTML = paragraph.innerHTML.replace(typeRegex, (match) => {
                return `<span class="type-${match}">${match}</span>`;
            });
        }
    } catch (error) {
        console.log("Fout bij ophalen van Pokémon type", error);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('pokemonID').value;
    const name = document.getElementById('PokemonNaam').value;
    const type = document.getElementById('Type').value;
    const gigantamax = document.getElementById('Gigantamax').value;

    const pokemon = { name, type, gigantamax };

    const method = id ? 'PUT' : 'POST';
    const url = id
        ? `http://localhost:3333/updatePokemon/${id}`
        : 'http://localhost:3333/NewPokemon';

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pokemon)
    })
        .then(() => {
            showAlert(id ? 'Pokemon bijgewerkt!' : 'Pokemon toegevoegd!', 'success');
            fetchpokemon();
            document.getElementById('form-wrapper').classList.add('hidden');

            document.getElementById('pokemonID').value = "";
            document.getElementById('PokemonNaam').value = "";
            document.getElementById('Type').value = "";
            document.getElementById('Gigantamax').value = "No";
        })
        .catch(() => showAlert('❌ Er ging iets mis.', 'error'));
}

function editpokemon(id) {
    fetch(`http://localhost:3333/Getpokemon/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('pokemonID').value = data.id;
            document.getElementById('PokemonNaam').value = data.name;
            document.getElementById('Type').value = data.type;
            document.getElementById('Gigantamax').value = data.gigantamax;
            document.getElementById('form-wrapper').classList.remove('hidden');
        })
        .catch(() => showAlert('Kan Pokémon niet laden.', 'error'));
}

function deletepokemon(id) {
    fetch(`http://localhost:3333/deletePokemon/${id}`, { method: 'DELETE' })
        .then(() => {
            showAlert('Pokemon verwijderd.', 'success');
            fetchpokemon();
        })
        .catch(() => showAlert('Verwijderen van pokemon is mislukt', 'error'));
}

function showAlert(message, type = 'success') {
    let alertBox = document.getElementById("alert");
    if (!alertBox) {
        alertBox = document.createElement("div");
        alertBox.id = "alert";
        document.body.appendChild(alertBox);
    }
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.classList.remove('hidden');
    setTimeout(() => alertBox.classList.add('hidden'), 3000);
}

