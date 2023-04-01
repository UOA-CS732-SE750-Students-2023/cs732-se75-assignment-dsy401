import {createServer} from 'http'
import {Server} from 'socket.io'
import express, {Express} from 'express'
import {registerApis} from "./src/api";
import {registerSockets} from "./src/socket";
import bodyParser from "body-parser";
import cors from 'cors'

const port = 3000 // TODO: config

const expressServer: Express = express()
const httpServer = createServer(expressServer)
const socketServer = new Server(httpServer, {
    cors: {
        origin: '*'
    }
})

expressServer.use(cors())

expressServer.use(bodyParser.urlencoded({extended: false}))
expressServer.use(bodyParser.json())

registerApis(expressServer)
registerSockets(socketServer)



expressServer.use((error: any,req: any,res:any,next: any)=>{
    const result = {
        errorMessage: error.message
    }
    res.status(error.status || 500);
    res.json(result)
})

httpServer.listen(port, () => {
    console.log(`🚀 [server]: Server is running on port ${port}`)
})