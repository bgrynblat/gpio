import express from 'express'
import bodyParser from 'body-parser'
import { Config, isValid, load, save } from './config';
import { start, stop } from './scheduler';
import {html} from "./index_minified"

const PORT = parseInt(process.env.PORT as string) || 3000;
const MAX_GPIO = parseInt(process.env.MAX_GPIO as string) || 26;
const AUTH_TOKEN = process.env.AUTH_TOKEN as string;

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
    res.send(html)
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


// const map = new Map<number, Gpio>()

// app.get('/gpio', (req, res) => {
//     const {pin, action} = req.query
//     const GPIO = parseInt(pin as string)
//     if(isNaN(GPIO) || !GPIO || GPIO > MAX_GPIO || GPIO < 1) {
//         res.status(400).send('Invalid pin')
//     }

//     if(!map.has(GPIO)) {
//         map.set(GPIO, new Gpio(GPIO, 'out'))
//     }

//     const gpio = map.get(GPIO) as Gpio

//     if(!action) {
//         return res.send({
//             pin: GPIO,
//             status: gpio.readSync()
//         })
//     } else if(action !== 'on' && action !== 'off' && action !== 'toggle') {
//         return res.status(400).send('Invalid action')
//     }

//     try {
//         let newValue:BinaryValue = 0
//         if(action === 'on') {
//             newValue = 1
//         } else if(action === 'off') {
//             newValue = 0
//         } else if(action === 'toggle') {
//             newValue = gpio.readSync() === 1 ? 0 : 1
//         }
//         gpio.writeSync(newValue)
//         res.send({
//             pin: GPIO,
//             status: gpio.readSync()
//         })
//     } catch(e) {
//         res.status(500).send((e as any).message)
//     }
// });

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

export default {app, server}