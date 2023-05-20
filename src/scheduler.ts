import { Config } from "./config"

const whatson:Map<string, boolean> = new Map()

let timeout:NodeJS.Timeout | undefined | null

export const start = (config:Config) => {
    if(timeout === undefined)  console.log(`${new Date().toISOString()}: Starting scheduler`)
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
            setTimeout(() => {
                console.log(`${new Date().toISOString()}: Turning off ${time.start}`)
                setTimeout(() => {
                    console.log(`${new Date().toISOString()}: Clearing up ${time.start}`)
                    whatson.delete(time.start)
                }, ((time.durationSeconds < 60 ? 60-time.durationSeconds : 0)+1)*1000)
            }, time.durationSeconds*1000)
        }
    })

    if(timeout !== null) {
        timeout = setTimeout(start, 1000, config)
    } else {
        console.log(`${new Date().toISOString()}: Scheduler stopped`)
        timeout = undefined
    }
}


export const stop = async () => {
    if(timeout === undefined || timeout === null) return
    console.log(`${new Date().toISOString()}: Stopping scheduler`)
    clearTimeout(timeout)
    timeout = null
    await new Promise(resolve => setTimeout(resolve, 1000))
    timeout = undefined
}
