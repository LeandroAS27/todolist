'use client'
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [taskList, setTaskList] = useState([])
  const [newTask, setNewTask] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    async function fetchData(){
      try {
        const response = await fetch("http://localhost:5000/tasks", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if(!response.ok){
          throw new Error("Erro ao buscar as tarefas")
        }
    
        const data = await response.json()
        setTaskList(data)
        console.log(data)
      } catch (error) {
        console.log('Erro ao buscar dados', error)
      }
    }
    fetchData()
  }, [])

  const handleEdit = (task) =>{
    setIsEditing(true)
    setEditingTaskId(task.idtasks)
    setNewTask(task.task)
  }

  const handleCancel = () => {
    setIsEditing(false);
    setEditingTaskId(null);
    setNewTask("");
  }

  const handleUpdate = async(id) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({task: newTask})
      })

      if(response.ok){
        setTaskList((prev) => prev.map((task) => task.idtasks === id ? {...task, task: newTask} : task))
        setIsEditing(false)
        setEditingTaskId(null);
      }
    } catch (error) {
      console.log("Erro ao atualizar a tarefa", error)      
    }
  }

  const handleDelete = async(id) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if(response.ok){
        alert('Tarefa deletada com sucesso')
        console.log(response)
      }
    } catch (error) {
      console.log("Erro ao deletar a tarefa", error) 
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if(newTask.trim('') === ''){
      alert("O campo precisa ser preenchido")
      return;
    }

    try {
      const response = fetch('http://localhost:5000/tasks', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({newTask})
      })

      if(response.ok){
        console.log("Tarefa adicionado com sucesso")
      }
    } catch (error) {
      console.log("Erro ao enviar a tarefa", error)
    }
  }


  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from gray-100 to-gray-300 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-xl max-w-xl w-full p-8">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-center text-gray-800">TodoList</h1>
          </header>

          <div>
            <form method="post" className="flex gap-4 mb-6">
              <input 
              type="text" 
              name="task"  
              placeholder="Digite a tarefa" 
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button 
              className="px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition duration-300"
              onClick={handleSubmit}
              >
                Adicionar Tarefa
              </button>
            </form>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-4">Tarefas:</h2>
              <ul className="space-y-3">
                {taskList.map((task) => (
                  <li key={task.idtasks} className="p-4 flex items-center justify-between border rounded">
                    {isEditing && editingTaskId === task.idtasks ? (
                      <>
                        <input 
                          type="text" 
                          value={newTask} 
                          placeholder="Adicione outro nome" 
                          onChange={(e) => setNewTask(e.target.value)} 
                          className="border p-2 rounded"
                        />

                        <div className="space-x-4">
                          <button className="text-green-500 hover:text-green-600 transition" onClick={() => handleUpdate(task.idtasks)}>
                            Atualizar
                          </button>

                          <button className="text-gray-500 hover: text-gray-600 transition" onClick={handleCancel}>
                            Cancelar
                          </button>
                        </div>

                      </>
                    ) : (
                      <>
                        <p className="text-gray-700">{task.task}</p>
                        <div className="space-x-4">
                          <button 
                          className="text-blue-500 hover:text-blue-600 transition"
                          onClick={() => handleEdit(task)}
                          >
                            Editar
                          </button>
                          <button 
                          className="text-red-500 hover:text-red-600 transition"
                          onClick={() => handleDelete(task.idtasks)}
                          >
                            Excluir
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
          </section>
        </div>
      </div>  
    </>
  );
}
