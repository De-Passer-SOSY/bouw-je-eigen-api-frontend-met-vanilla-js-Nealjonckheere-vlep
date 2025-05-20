"use strict";


//Helemaal zelf GEBRUIK PULL FROM DATABASE SLIMME AAP
document.addEventListener("DOMContentLoaded", init)

function init(){
    pokemon()
    console.log("Website Werd geladen")
}

async function pokemon(){
    let response = await fetch('https://localhost:3333' + benodiged_functie + PKid )
    let data = await response.json();
}


function benodiged_functie (){

}

function PKid (){


}

// extra's als ik tijd over heb deze voor flits bij de drie gekleurde bolletjes
function Flash (){
    document.getElementById('foto-zone').style.backgroundColor = kleur
}