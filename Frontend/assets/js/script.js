"use strict";



document.addEventListener("DOMContentLoaded", init)

function init(){
    fetchpokemon()
    console.log("Website Werd geladen")


    const form = document.getElementById('absence-form');
    const formWrapper = document.getElementById('form-wrapper');
    const openFormBtn = document.getElementById('open-form');


    openFormBtn.addEventListener('click', () => {
        formWrapper.classList.remove('hidden');
        form.scrollIntoView({ behavior: 'smooth' });
    });
}

function fetchpokemon() {
    fetch("http://localhost:3333/pokemon")
        .then(res => res.json())
        .then(data => {

            const sorted = data.sort((a, b) => a.id - b.id);
            showPokemon(sorted);
        })
        .catch(error => console.log("Fout bij ophalen van Pokémon:", error));
}

function showPokemon(pokemonList) {
    try {
        const list = document.getElementById("pokemonGroup");

        list.innerHTML = "";

        pokemonList.forEach(pokemon => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${pokemon.id}</td>
                <td>${pokemon.name}</td>
                <td>${pokemon.type}</td>
                <td>${pokemon.gigantamax}</td>
                <td>
                    <button class="et-btn" data-id="${pokemon.id}">bewerk</button>
                    <button class="dlt-btn" data-id="${pokemon.id}">Verwijder</button>
                </td>
            `;
            list.appendChild(row);
            row.querySelector(".et-btn").addEventListener("click", (e) => editpokemon(pokemon.id))
            row.querySelector(".dlt-btn").addEventListener("click", (e) => deletepokemon(pokemon.id))
        });
    } catch (error) {
        console.log("Spel werd niet geladen:", error);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('pokemonID').value;
    const pokemon = {
        pokemonaam: document.getElementById('PokemonNaam').value,
        type: document.getElementById('Type').value,
        Gigantamax: document.getElementById('Gigantamax').value,
    };

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
            showAlert(id ? 'Pokemon bijgewerkt!' : 'po!', 'success');
            fetchpokemon();
            document.getElementById('form-wrapper').classList.add('hidden');
        })
        .catch(() => showAlert('❌ Er ging iets mis.', 'error'));
}


function editpokemon(pokemon) {


}




function deletepokemon(id) {
    fetch(`http://localhost:3333/deletePokemon/${id}`, {method: 'DELETE'})
        .then(() => {
            showAlert('Pokemon verwijderd.', 'success');
            fetchpokemon();
        })
        .catch(() => showAlert('Verwijderen van pokemon is misslukt', 'error'));

}

function showAlert(message, type = 'success') {
    const alertBox = document.getElementById("alert");
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.classList.remove('hidden');
    setTimeout(() => alertBox.classList.add('hidden'), 3000);
}



// extra's als ik tijd over heb deze voor flits bij de drie gekleurde bolletjes
function Flash (){
    document.getElementById('foto-zone').style.backgroundColor = kleur
}
