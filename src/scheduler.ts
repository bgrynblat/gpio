import { Config } from "./config"
import { turnOff, turnOn } from "./gpio"

const whatson:Map<string, boolean> = new Map()

let interval:NodeJS.Timeout | undefined | null

const GPIO_RELAY = 21

export const execute = (config:Config) => {
    const now = new Date()
    const day = now.getDay() // 1 = Monday, 2 = Tuesday, etc.
    if(!config.days[day-1]) return
    const currentHour = now.getHours()<10 ? `0${now.getHours()}` : `${now.getHours()}`
    const currentMinute = now.getMinutes()<10 ? `0${now.getMinutes()}` : `${now.getMinutes()}`
    const currentTime = `${currentHour}${currentMinute}`
    config.times.forEach((time) => {
        if(currentTime === time.start && !whatson.get(time.start)) {
            console.log(`${new Date().toISOString()}: Turning on ${time.start} for ${time.durationSeconds} seconds`)
            whatson.set(time.start, true)
            turnOn(GPIO_RELAY)
            setTimeout(() => {
                console.log(`${new Date().toISOString()}: Turning off ${time.start}`)
                turnOff(GPIO_RELAY)
                setTimeout(() => {
                    console.log(`${new Date().toISOString()}: Clearing up ${time.start}`)
                    whatson.delete(time.start)
                }, ((time.durationSeconds < 60 ? 60-time.durationSeconds : 0)+1)*1000)
            }, time.durationSeconds*1000)
        }
    })
}

export const start = (config:Config) => {
    console.log(`${new Date().toISOString()}: Starting scheduler`)
    interval = setInterval(execute, 1000, config)
}


export const stop = async () => {
    if(interval === undefined || interval === null) return
    console.log(`${new Date().toISOString()}: Stopping scheduler`)
    clearInterval(interval)
    interval = undefined
}
