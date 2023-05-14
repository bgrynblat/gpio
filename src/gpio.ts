import {Gpio} from 'onoff'

const GPIO = parseInt(process.env.GPIO as string) || 17

const led = new Gpio(GPIO, 'out');
//const button = new Gpio(4, 'in', 'both');

let status = false
setInterval(() => {
	status = !status
	led.writeSync(status ? 1 : 0)
	console.log(`STATUS ${GPIO}: ${status}`)
}, 5000);
