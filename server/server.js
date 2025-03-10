// import { createConnection } from 'mysql'
import app from './index.js'
import dotenv from 'dotenv'
import mysql from 'mysql2'

dotenv.config()

const port = process.env.PORT || 5000

export const conexao = mysql.createConnection(process.env.DATABASE_URL)

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

