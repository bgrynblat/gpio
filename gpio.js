const Gpio = require('onoff').Gpio;

const GPIO = parseInt(process.env.GPIO) || 17

const led = new Gpio(GPIO, 'out');
//const button = new Gpio(4, 'in', 'both');

let status = false
setInterval(() => {
	status = !status
	led.writeSync(status ? 1 : 0)
	console.log(`STATUS ${GPIO}: ${status}`)
}, 5000);
