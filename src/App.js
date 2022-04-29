import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import React, { useState, useEffect } from 'react';
import "./App.css";
import { API } from 'aws-amplify';
import Game from "./components/Game";
// import React from 'react';
import Amplify from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);


const initialFormState = { name: '', description: '' }

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const darkHandler = (dark) => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };
  
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  return (
    <div className={"app dark:bg-zinc-800"}>
      <Game darkness={darkHandler} />
      <br></br>
      <br></br>
      <h1 className="text-3xl font-bold tracking-wider">REVIEWS</h1>
      <br></br>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="              Review"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="       Rate us out of 5"
        value={formData.description}
      />
      <br></br>
      <button className='button' onClick={createNote}><b>SUBMIT</b></button>
      <br></br>
      <div style={{marginBottom: 50}}>
        {
          notes.map(note => (
            <div key={note.id || note.name}>
              <br></br>
              <h2>{note.name}</h2>
              <p>{note.description}</p>
              <br></br>
              <button className='button1' onClick={() => deleteNote(note)}>Delete note</button>
              <br></br>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
