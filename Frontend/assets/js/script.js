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

function showPokemon(pokemonList) {
    const list = document.getElementById("pokemonGroup");
    list.innerHTML = "";

    pokemonList.forEach(pokemon => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${pokemon.id}</td>
            <td>${pokemon.name}</td>
            <td>${pokemon.type}</td>
            <td>${pokemon.gigantamax === 1 ? 'Ja' : 'Nee'}</td>
            <td>
                <button class="et-btn" data-id="${pokemon.id}">Bewerk</button>
                <button class="dlt-btn" data-id="${pokemon.id}">Verwijder</button>
            </td>
        `;
        list.appendChild(row);
        row.querySelector(".et-btn").addEventListener("click", () => editpokemon(pokemon.id));
        row.querySelector(".dlt-btn").addEventListener("click", () => deletepokemon(pokemon.id));
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('pokemonID').value;
    const name = document.getElementById('PokemonNaam').value;
    const type = document.getElementById('Type').value;
    const gigantamax = parseInt(document.getElementById('Gigantamax').value);

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
            document.getElementById('Gigantamax').value = data.gigantamax.toString();

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
