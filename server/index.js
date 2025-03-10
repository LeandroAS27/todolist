import express from 'express';
import cors from 'cors'; 
const app = express()
import { conexao } from './server.js';

//indicar para o express ler body com json
app.use(cors({
    origin: "*",
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type"],
}))

app.use(express.json());

app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.send("Funcionando")
})


//crud

//GET

app.get('/tasks', (req, res) => {
    const sql = 'SELECT * from tasks';

    conexao.query(sql, (error, result) => {
        if(error){
            return res.status(500).json({message: "Erro no servidor"})
        }
        res.status(200).json(result)
    })
})

//Create

app.post('/tasks', (req, res) => {
    const task = req.body.newTask

    if(task.trim('') === ''){
        console.log("Task precisa ser preenchida")
        return
    }

    console.log("Corpo da requisicao", task)

    const sql = 'INSERT INTO `railway`. `tasks` (`task`) VALUES (?);'

    conexao.query(sql, [task], (error, result) => {
        if(error){
            console.log("Erro ao enviar a tarefa", error)
            return res.status(500).json({message: "Erro no servidor"})
        }
            res.status(200).json(result)
            console.log(result)
    })
})


//Update

app.put('/tasks/:id', (req, res) => {
    const idtasks = req.params.id;
    const newTask = req.body.task;

    console.log(newTask)

    const sql = "UPDATE `tasks` SET `task` = ? WHERE `idtasks` = ?;"

    conexao.query(sql, [newTask, idtasks], (error, result) => {
        if(error){
            console.log("Erro ao atualizar a tarefa", error)
            return res.status(500).json({message: "Erro ao atualizar a tarefa no servidor"})
        }else{
            res.status(200).json({message: "Tarefa atualizada com sucesso", result})
            console.log(result)
        }
    })
})

//Delete
app.delete('/tasks/:id', (req, res) => {
    const idtasks = req.params.id
    
    const sql = "DELETE FROM tasks WHERE idtasks=?;"

    conexao.query(sql, [idtasks], (error, result) => {
        if(error){
            console.log("Erro ao deletar a tarefa", error)
            return res.status(500).json({message: "Erro ao deletar a tarefa no servidor"})
        }else{
            res.status(200).json(result)
            console.log(result)
        }
    })
})

export default app;



