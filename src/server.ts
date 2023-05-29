import express from 'express'
import bodyParser from 'body-parser'
import { Config, isValid, load, save } from './config';
import { start, stop } from './scheduler';
import { read, toggle, turnOff, turnOn } from './gpio';
import { GPIO_RELAY } from '.';
import path from 'path';

const PORT = parseInt(process.env.PORT as string) || 3000;
const MAX_GPIO = parseInt(process.env.MAX_GPIO as string) || 26;
const AUTH_TOKEN = process.env.AUTH_TOKEN as string;
const HTML_PATH = process.env.HTML_PATH as string || `${__dirname}/../public`;

const app = express();
app.use(bodyParser.json())

app.use((req, res, next) => {
    if(!AUTH_TOKEN) return next()
    if(!req.headers['authorization'] || req.headers['authorization'] !== AUTH_TOKEN) {
        return res.status(401).send({error: 'Unauthorized'})
    }
    next()
})

app.get('/', (req, res) => {
    res.sendFile(path.resolve(`${HTML_PATH}/index.html`))
});

app.get('/config', (req, res) => {
    res.send(load())
});

app.post('/config', async (req, res) => {
    try {
        console.log(req.body)
        const config = req.body as Config
        if(isValid(config)) {
            await stop()
            save(config)
            start(config)
            res.send(config)
        } else {
            res.status(400).send('Invalid config')
        }
    } catch(e) {
        res.status(500).send((e as any).message)
    }
});


app.get('/manual', (req, res) => {
    const {action} = req.query

    if(!action) {
        return res.send({status: read(GPIO_RELAY)})
    } else if(action !== 'on' && action !== 'off' && action !== 'toggle') {
        return res.status(400).send('Invalid action')
    }

    try {
        if(action === 'on') {
            turnOn(GPIO_RELAY)
        } else if(action === 'off') {
            turnOff(GPIO_RELAY)
        } else if(action === 'toggle') {
            toggle(GPIO_RELAY)
        }
        res.send({status: read(GPIO_RELAY)})
    } catch(e) {
        res.status(500).send((e as any).message)
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

export default {app, server}