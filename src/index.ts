import './server'
import { load } from './config'
import { start } from './scheduler'

const config = load()
start(config)