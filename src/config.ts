import fs from 'fs' 

export type Config = {
    days: [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
    times: {
        start: string,
        durationSeconds: number
    }[]
}

export const load = () => {
    let config:Config
    if(fs.existsSync("config.json")) {
        config = JSON.parse(fs.readFileSync('config.json', 'utf8')) as Config
    } else {
        config = {
            days: [false, false, false, false, false, false, false],
            times: [
                {
                    start: "0930",
                    durationSeconds: 60
                },
                {
                    start: "1200",
                    durationSeconds: 20
                },
                {
                    start: "1900",
                    durationSeconds: 60
                },
            ]
        }
    }
    return config
}

export const save = (config:Config) => {
    fs.writeFileSync('config.json', JSON.stringify(config))
}

export const isValid = (config:Config) => {
    // Check if config is an object
    if (typeof config !== 'object' || Array.isArray(config)) {
      return false;
    }
  
    // Check if 'days' property exists and is an array
    if (!Array.isArray(config.days)) {
      return false;
    }
  
    // Check if 'days' array has exactly 7 boolean values
    if (config.days.length !== 7 || !config.days.every(val => typeof val === 'boolean')) {
      return false;
    }
  
    // Check if 'times' property exists and is an array
    if (!Array.isArray(config.times)) {
      return false;
    }
  
    // Check if 'times' array elements are objects with 'start' and 'durationSeconds' properties
    if (!config.times.every(time => typeof time === 'object' && time !== null && typeof time.start === 'string' && typeof time.durationSeconds === 'number')) {
      return false;
    }
  
    // Check if 'start' property of each time object is a valid time string (HHMM format)
    if (!config.times.every(time => /^\d{4}$/.test(time.start))) {
      return false;
    }
  
    // Check if 'durationSeconds' property of each time object is a positive integer
    if (!config.times.every(time => Number.isInteger(time.durationSeconds) && time.durationSeconds > 0)) {
      return false;
    }
  
    // All checks passed, config is valid
    return true;
}
  