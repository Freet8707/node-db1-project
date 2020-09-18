const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {

    db.select("*").from("Accounts")
    .then(response => {
        res.status(200).send(response)
    })
    .catch(error => {
        res.status(500).json({error: "There was an error retrieving that data"})
    })

})

server.post("/", (req, res) => {
    const { name, budget } = req.body;

    if (!name || !budget) {
        return res.status(400).json({message: "Please supply a name and budget for the account"})
    }

    db("Accounts").insert({ name: name, budget: budget})
        .then(response => {
            res.status(201).json(response)
        })
        .catch(error => {
            res.status(500).json({message: "There was an error creating that account.", error: error})
        });
})

server.put("/:id", (req, res) => {
    const { id } = req.params;

    const { name, budget } = req.body;

    let nameUpdate = "";

    let budgetUpdate = "";

    if(name) {
        nameUpdate = name
    } 
    if (budget) {
        budgetUpdate = budget
    } else {
        return res.status(400).json({message: "Must provide either an updated name or budget value!"})
    }

    db("Accounts").where("id", id)
    .update({ name: nameUpdate, budget: budgetUpdate})
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json({message: "There was an error updating", error: error})
        })

    
})

server.delete("/:id", (req, res) => {
    const { id } = req.params;

    db("Accounts").where("id", id)
    .delete()
        .then(response => {
            res.status(204).json({message: response})
        })
        .catch(error => {
            res.status(500).json({message: "There was an error deleting that resource", error: error})
        });
        
})

module.exports = server;
