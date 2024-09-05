import React, { useState, useEffect } from "react";

// Incluye imágenes en tu bundle
import rigoImage from "../../img/rigo-baby.jpg";

const API_URL = 'https://playground.4geeks.com/todo/users/juandiaz';

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        // Fetch tasks from the API when the component mounts
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
    }, []); // Empty dependency array means this effect runs once on mount

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
        if (inputValue.trim() === "") return; // Prevent adding empty tasks
        const newTasks = [...todos, inputValue.trim()];
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
            setTodos([]); // Clear tasks from the front-end
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
                            if (e.key === "Enter") {
                                addTask();
                            }
                        }}
                        placeholder="What do you need to do?"
                    />
                </li>
                {todos.map((item, index) => (
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
