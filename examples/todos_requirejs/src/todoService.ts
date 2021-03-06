import {Todo} from './Todo'

let todos: Todo[] = [
    {id: 0, text: 'Prepare an awesome meal.', completed: false},
    {id: 1, text: 'Buy groceries.', completed: true},
    {id: 2, text: 'Eat!', completed: false}
]

const todoServiceFactory = () => {

    function findTodos(): Promise<Todo[]> {
        return new Promise((resolve, _reject) => resolve(todos))
    }

    function createTodo(text: string): Promise<Todo> {
        return new Promise((resolve, _reject) => {
            const nextId = Math.max(...todos.map(t => t.id)) + 1
            const newTodo = {id: nextId, text, completed: false}

            todos.push(newTodo)
            resolve(newTodo)
        })
    }

    function updateTodoStatus(todo: Todo, completed: boolean): Promise<Todo> {
        return new Promise((resolve, reject) => {
            const targetTodo = todos.find(t => t.id === todo.id)
            if (targetTodo) {
                targetTodo.completed = completed
                resolve(targetTodo)
            } else {
                reject()
            }
        })
    }

    function deleteTodo(todo: Todo): Promise<void> {
        return new Promise((resolve, _reject) => {
            todos = todos.filter(t => t.id !== todo.id)
            resolve()
        })
    }

    return {findTodos, createTodo, updateTodoStatus, deleteTodo}
}

export const todoService = todoServiceFactory()
export type TodoService = typeof todoService
