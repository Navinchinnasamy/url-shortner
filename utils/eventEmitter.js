import { EventEmitter } from 'events';

class UrlEventEmitter extends EventEmitter {}

const urlEmitter = new UrlEventEmitter();

export default urlEmitter;
