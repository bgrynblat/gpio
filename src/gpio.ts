import {Gpio} from 'onoff'

// const GPIO = parseInt(process.env.GPIO as string) || 17

// const led = new Gpio(GPIO, 'out');
// //const button = new Gpio(4, 'in', 'both');

// let status = false
// setInterval(() => {
// 	status = !status
// 	led.writeSync(status ? 1 : 0)
// 	console.log(`STATUS ${GPIO}: ${status}`)
// }, 5000);
let gpios:Gpio[] = []
try {
	gpios = [
		new Gpio(1, 'out'),
		new Gpio(2, 'out'),
		new Gpio(3, 'out'),
		new Gpio(4, 'out'),
		new Gpio(5, 'out'),
		new Gpio(6, 'out'),
		new Gpio(7, 'out'),
		new Gpio(8, 'out'),
		new Gpio(9, 'out'),
		new Gpio(10, 'out'),
		new Gpio(11, 'out'),
		new Gpio(12, 'out'),
		new Gpio(13, 'out'),
		new Gpio(14, 'out'),
		new Gpio(15, 'out'),
		new Gpio(16, 'out'),
		new Gpio(17, 'out'),
		new Gpio(18, 'out'),
		new Gpio(19, 'out'),
		new Gpio(20, 'out'),
		new Gpio(21, 'out'),
	]
} catch(e) {
	console.error(e)
}

export const turnOn = (gpio:number) => {
	if(gpios[gpio-1] && !!gpios[gpio-1].writeSync)
		gpios[gpio-1].writeSync(1)
}

export const turnOff = (gpio:number) => {
	if(gpios[gpio-1] && !!gpios[gpio-1].writeSync)
		gpios[gpio-1].writeSync(0)
}

