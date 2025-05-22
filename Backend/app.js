const express = require("express");
const cors = require("cors");
const db = require("./services/db");

const app = express();
app.use(cors());
app.use(express.json());


app.get("/pokemon/", async (req, res) => {
    try {
        const results = await db("Pokemon");
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: "Interne serverfout" });
    }
});


app.get("/Getpokemon/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const pokemon = await db("Pokemon").where({ id }).first();
        if (pokemon) {
            res.status(200).json(pokemon);
        } else {
            res.status(404).json({ error: "Pokemon niet gevonden" });
        }
    } catch (err) {
        res.status(500).json({ error: "Interne serverfout" });
    }
});

app.post("/NewPokemon", async (req, res) => {
    const { name, type, gigantamax } = req.body;

    if (!name || !type || gigantamax === undefined) {
        return res.status(400).json({ message: "Vul alle velden in" });
    }

    try {
        const [id] = await db("Pokemon").insert({ name, type, gigantamax });
        res.status(201).json({
            message: "Succesvol toegevoegd",
            id: id
        });
    } catch (error) {
        res.status(500).json({ message: "Fout bij het toevoegen van Pokémon" });
    }
});

app.put("/updatePokemon/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, type, gigantamax } = req.body;
    if (!name || !type || !gigantamax) {
        return res.status(400).json({ error: "Vul alle velden in." });
    }
    try {
        const count = await db("Pokemon")
            .where({ id })
            .update({ name, type, gigantamax  });
        if (count === 0) {
            return res.status(404).json({ error: "Pokemon niet gevonden." });
        }
        const updated = await db("Pokemon").where({ id }).first();
        res.status(200).json({
            message: "Pokemon bijgewerkt",
            updated: updated
        });
    } catch (err) {
        res.status(500).json({ error: "Fout bij updaten van de databank" });
    }
});

app.delete("/deletePokemon/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {

        const deleted = await db("Pokemon").where({ id }).del();
        if (deleted === 0) {

            return res.status(404).json({ error: "Pokemon niet gevonden." });
        }

        res.status(200).json({ message: `Pokemon met ID ${id} verwijderd.` });
    } catch (err) {
        res.status(500).json({ error: "Fout bij verwijderen uit de databank." });
    }
});

app.listen(3333, () => {
    console.log("Het API draait op http://localhost:3333");
});

// Put en delete moeten nog er in