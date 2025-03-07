import { createConnection } from 'mysql'
import dotenv from 'dotenv'
import app from './index.js'

dotenv.config()

const port = process.env.PORT || 5000

export const conexao = createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE
})

conexao.connect((error) => {
    if(error){
        console.log("Erro ao conectar no banco de dados")
    }
    else{
        console.log("Servidor funcionando")
        app.listen(port, () =>{
            console.log(`Servidor funcionando na porta ${port}`)
        })
    }
})

