import express from 'express'
import {BinaryValue, Gpio} from 'onoff'
import bodyParser from 'body-parser'

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
    res.send('OK');
});

app.get('/gpio', (req, res) => {
    const {pin, action} = req.query
    const GPIO = parseInt(pin as string)
    if(isNaN(GPIO) || !GPIO || GPIO > MAX_GPIO || GPIO < 1) {
        res.status(400).send('Invalid pin')
    }
    const gpio = new Gpio(GPIO, 'out')

    if(!action || (action !== 'on' && action !== 'off' && action !== 'toggle')) {
        return res.send({
            pin: GPIO,
            status: gpio.readSync()
        })
    }

    try {
        let newValue:BinaryValue = 0
        if(action === 'on') {
            newValue = 1
        } else if(action === 'off') {
            newValue = 0
        } else if(action === 'toggle') {
            newValue = gpio.readSync() === 1 ? 0 : 1
        }
        gpio.writeSync(newValue)
        res.send({
            pin: GPIO,
            status: gpio.readSync()
        })
    } catch(e) {
        res.status(500).send((e as any).message)
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})