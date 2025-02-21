const redis = require('redis')
const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1'
    // url: 'redis://127.0.0.1:6379'
})

client.connect().then(()=>{
    console.log("Client is connected to redis")
})

client.on('error',(err)=> {
    console.log(err.message)
})

client.on('ready',()=>{
    console.log("Client is connected to redis and ready to use")
})

client.on('end',()=>{
    console.log("Client disconnected from redis")
})

process.on('SIGINT', ()=> {
    client.quit()
})

module.exports = client