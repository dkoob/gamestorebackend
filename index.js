// requires
const pg = require('pg')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
// clients
const client = new pg.Client("postgres://localhost/gamestore")
const app = express()

const start = async () => {
    await client.connect()
    console.log("Connected to the database")
    const SQL = `
        DROP TABLE IF EXISTS videogames;
        DROP TABLE IF EXISTS boardgames;

        CREATE TABLE videogames (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            type VARCHAR(100),
            description VARCHAR(1000),
            price VARCHAR(25),
            imageUrl VARCHAR(500),
            ratingStars INT
        );
        CREATE TABLE boardgames (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            description VARCHAR(1000),
            price VARCHAR(25),
            imageUrl VARCHAR(500),
            ratingStars INT
        );

        INSERT INTO videogames (name, type, description, price, imageUrl, ratingStars) VALUES (
            'Terraria',
            'Sandbox',
            'Terraria is a 2D sandbox game with gameplay that revolves around exploration, building, crafting, combat, survival, and mining, playable in both single-player and multiplayer modes. The game has a 2D sprite tile-based graphical style reminiscent of the 16-bit sprites found on the Super NES.',
            '$9.99',
            'https://static.wikia.nocookie.net/terraria_gamepedia/images/a/a4/NewPromoLogo.png/revision/latest/scale-to-width-down/486?cb=20200506135559',
            '5'
        );
        INSERT INTO boardgames (name, description, price, imageUrl, ratingStars) VALUES (
            'Monopoly',
            'Monopoly is a multiplayer economics-themed board game. In the game, players roll two dice to move around the game board, buying and trading properties and developing them with houses and hotels. Players collect rent from their opponents and aim to drive them into bankruptcy.',
            '$19.99',
            'https://i.pinimg.com/originals/2c/48/75/2c48755938d4e51ca8f76ced8b3912af.png',
            '5'
            
        );
    `
    await client.query(SQL)
    console.log("Table create and data seeded")

    const port = process.env.PORT || 3000
    app.listen(port, () => {
        console.log(`app running on port ${port}`)
    })
}

start()