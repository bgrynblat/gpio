import './server'
import { load } from './config'
import { start } from './scheduler'

export const GPIO_RELAY = 21

const config = load()
start(config)