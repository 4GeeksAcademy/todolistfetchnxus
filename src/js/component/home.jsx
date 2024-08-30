import React, { useState, useEffect } from "react";

// Incluye imágenes en tu bundle
import rigoImage from "../../img/rigo-baby.jpg";

const API_URL = 'https://playground.4geeks.com/todo/user/alesanchezr';

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                
                if (Array.isArray(data)) {
                    setTodos(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                }
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);

    const updateTasksOnServer = (tasks) => {
        fetch(API_URL, {
            method: "PUT",
            body: JSON.stringify(tasks),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => console.log('Tasks updated:', data))
        .catch(error => console.error('Error updating tasks:', error));
    };

    const addTask = () => {
        const newTasks = todos.concat([inputValue]);
        setTodos(newTasks);
        updateTasksOnServer(newTasks);
        setInputValue("");
    };

    const removeTask = (index) => {
        const newTasks = todos.filter((_, currentIndex) => index !== currentIndex);
        setTodos(newTasks);
        updateTasksOnServer(newTasks);
    };

    const clearAllTasks = () => {
        fetch(API_URL, {
            method: "DELETE",
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            setTodos([]);
            console.log('All tasks deleted from server');
        })
        .catch(error => console.error('Error deleting all tasks:', error));
    };

    return (
        <div className="container">
            <h1>My to do list</h1>
            <ul>
                <li>
                    <input 
                        type="text"
                        onChange={(e) => setInputValue(e.target.value)}
                        value={inputValue}
                        onKeyPress={(e) => {
                            if (e.key === "Enter" && inputValue) {
                                addTask();
                            }
                        }}
                        placeholder="What do you need to do?"
                    />
                </li>
                {Array.isArray(todos) && todos.map((item, index) => (
                    <li key={index}>
                        {item} 
                        <i 
                            className="fas fa-trash-alt"
                            onClick={() => removeTask(index)}
                        ></i>
                    </li>
                ))}
            </ul>
            <div>{todos.length} tasks left</div>
            <button onClick={clearAllTasks}>Clear All Tasks</button>
        </div>
    );
}

export default Home;
