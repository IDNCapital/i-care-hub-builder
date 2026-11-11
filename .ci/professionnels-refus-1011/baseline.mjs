export const calls=[];
const deny=name=>function(){calls.push(name);throw Error('PORT FERME '+name);};
const values={fetch:deny('fetch'),XMLHttpRequest:deny('XMLHttpRequest'),WebSocket:deny('WebSocket'),EventSource:deny('EventSource')};
const beacon=deny('beacon'),anchor=deny('anchor.click');
export function close(surface,navigator,prototype){for(const [key,value]of Object.entries(values))Object.defineProperty(surface,key,{configurable:true,writable:false,value});if(navigator)Object.defineProperty(navigator,'sendBeacon',{configurable:true,writable:false,value:beacon});if(prototype)Object.defineProperty(prototype,'click',{configurable:true,writable:false,value:anchor});}
export function exact(surface,navigator,prototype){return Object.entries(values).every(([key,value])=>surface[key]===value&&!Object.getOwnPropertyDescriptor(surface,key).writable)&&(!navigator||navigator.sendBeacon===beacon)&&(!prototype||prototype.click===anchor);}
