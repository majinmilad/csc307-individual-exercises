// src/MyApp.jsx

import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() 
{
  const [characters, setCharacters] = useState([]);

  function updateList(person) {
    postUser(person)
      .then(response => {
        if (response.status === 201) {
          return response.json();
        } else {
          console.log('Failed to update list. Invalid HTTP code (not 201).');
        }
      })
      .then((newUser) => {
        setCharacters([...characters, newUser]);
        console.log(newUser + 'added to list.');
      })
      .catch((error) => {
        console.log(error);
      })
  }
 
  function removeOneCharacter(index) {
    const userToDelete = characters[index];

    fetch(`http://localhost:8000/users/${userToDelete.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 204) {
          // backend successfully deleted the user
          const updated = characters.filter((_, i) => i !== index);
          setCharacters(updated); // update the state after backend confirms
        } else if (response.status === 404) {
          console.log("User not found on the server.");
        } else {
          console.log("Failed to delete the user. Invalid status code.");
        }
      })
      .catch((error) => {
        console.log("Error deleting user: ", error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => { // hook
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []); // empty array here instructs hook to be called when MyApp component first mounts

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });
  
    return promise;
  }
  
  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;