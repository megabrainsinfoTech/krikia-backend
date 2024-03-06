import { createClient } from "redis"

const client = createClient();

client.on("connect", ()=> {
    console.log("Client connected to redis")
})

client.on("ready", ()=> {
    console.log("Client ready to use redis")
})

client.on("error", (err)=> {
    console.error(err)
})

client.on("end", ()=> {
    console.log("Client has disconnected from redis")
})

export default (client.connect() as Promise<any>);