// requires
const pg = require('pg')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
// clients
const client = new pg.Client("postgres://localhost/gamestore")
const app = express()
app.use(morgan('dev'))
app.use(express.json())
// videogames methods
app.get('/api/videogames', async (req, res, next) => {
    try {
        const SQL = `
        SELECT * FROM videogames
        `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})
app.get('/api/videogames/:id', async (req, res, next) => {
    try {
        const SQL = `
        SELECT * FROM videogames WHERE id = $1
        `
        const response = await client.query(SQL, [req.params.id])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})
app.delete('/api/videogames/:id', async (req, res, next) => {
    try {
        const SQL = `
        DELETE FROM videogames WHERE id = $1
        `
        const response = await client.query(SQL, [req.params.id])
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})
app.post('/api/videogames', async (req, res, next) => {
    try {
        const SQL = `
        INSERT INTO videogames (name, type, description, price, imageUrl, ratingStars) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `
        const response = await client.query(SQL, [
            req.body.name,
            req.body.type,
            req.body.description,
            req.body.price,
            req.body.imageUrl,
            req.body.ratingStars
        ])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})
app.put('/api/videogames/:id', async (req, res, next) => {
    try {
        const SQL = `
        UPDATE videogames SET name = $1, type = $2, description = $3, price = $4, imageUrl = $5, ratingStars = $6 WHERE id = $7 RETURNING *
        `
        const response = await client.query(SQL, [
            req.body.name || null,
            req.body.type || null,
            req.body.description || null,
            req.body.price || null,
            req.body.imageUrl || null,
            req.body.ratingStars || null,
            req.params.id
        ])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})
// boardgames methods
app.get('/api/boardgames', async (req, res, next) => {
    try {
        const SQL = `
        SELECT * FROM boardgames
        `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})
app.get('/api/boardgames/:id', async (req, res, next) => {
    try {
        const SQL = `
        SELECT * FROM boardgames WHERE id = $1
        `
        const response = await client.query(SQL, [req.params.id])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})
app.delete('/api/boardgames/:id', async (req, res, next) => {
    try {
        const SQL = `
        DELETE FROM boardgames WHERE id = $1
        `
        const response = await client.query(SQL, [req.params.id])
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})
app.post('/api/boardgames', async (req, res, next) => {
    try {
        const SQL = `
        INSERT INTO boardgames (name, description, price, imageUrl, ratingStars) VALUES ($1, $2, $3, $4, $5) RETURNING *
        `
        const response = await client.query(SQL, [
            req.body.name,
            req.body.description,
            req.body.price,
            req.body.imageUrl,
            req.body.ratingStars
        ])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})
app.put('/api/boardgames/:id', async (req, res, next) => {
    try {
        const SQL = `
        UPDATE boardgames SET name = $1, description = $2, price = $3, imageUrl = $4, ratingStars = $65WHERE id = $6 RETURNING *
        `
        const response = await client.query(SQL, [
            req.body.name || null,
            req.body.description || null,
            req.body.price || null,
            req.body.imageUrl || null,
            req.body.ratingStars || null,
            req.params.id
        ])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})
//
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