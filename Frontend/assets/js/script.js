"use strict";


//Helemaal zelf GEBRUIK PULL FROM DATABASE SLIMME AAP
document.addEventListener("DOMContentLoaded", init)

function init(){
    pokemon()
    console.log("Website Werd geladen")
}

function pokemon() {
    fetch("http://localhost:3333/pokemon")
        .then(res => res.json())
        .then(data => {
            // Sorteer Pokémon op id
            const sorted = data.sort((a, b) => a.id - b.id);
            showPokemon(sorted);
        })
        .catch(error => console.log("Fout bij ophalen van Pokémon:", error));
}

function showPokemon(pokemonList) {
    try {
        const list = document.getElementById("pokemonGroup");

        list.innerHTML = ""; // Leegmaken

        pokemonList.forEach(pokemon => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${pokemon.id}</td>
                <td>${pokemon.name}</td>
                <td>${pokemon.type}</td>
                <td>${pokemon.gigantamax}</td>
                <td>
                    <button class="et-btn" data-id="${pokemon.id}">✏️ Wijzig</button>
                    <button class="dlt-btn" data-id="${pokemon.id}">🗑️ Verwijder</button>
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







// extra's als ik tijd over heb deze voor flits bij de drie gekleurde bolletjes
function Flash (){
    document.getElementById('foto-zone').style.backgroundColor = kleur
}