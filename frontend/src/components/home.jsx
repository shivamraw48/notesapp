import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import deleteicon from "../assets/delete.png";
import editicon from "../assets/edit.svg";
import { notesAPI, authAPI } from '../services/api';

const Home = () => {
    const [input, setInput] = useState("")
    const [tagsInput, setTagsInput] = useState("");
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState(null);

    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingNoteText, setEditingNoteText] = useState("");
    const [editingNoteTags, setEditingNoteTags] = useState("");

    const addNote = async (text, tags) => {
        try {
            const res = await notesAPI.create(text, tags);
            return res;
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    const handler = async () => {
        if (input === "") {
            setError('Note cannot be empty');
            return;
        }
        setButtonLoading(true);
        setError('');
        const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
        const savedNote = await addNote(input, tagsArray);
        if (savedNote) {
            setNotes([savedNote, ...notes]);
            setInput("");
            setTagsInput("");
        }
        setButtonLoading(false);
    };

    const handleEditNote = async (noteId) => {
        const tagsArray = editingNoteTags.split(',').map(tag => tag.trim()).filter(Boolean);
        setButtonLoading(true);
        setError('');
        try {
            const updatedNote = await notesAPI.update(noteId, editingNoteText, tagsArray);
            setNotes(notes.map(note => note._id === updatedNote._id ? updatedNote : note));
            cancelEditing();
        } catch (err) {
            setError(err.message);
        }
        setButtonLoading(false);
    };

    const startEditing = (note) => {
        setEditingNoteId(note._id);
        setEditingNoteText(note.text);
        setEditingNoteTags(note.tags.join(', '));
    };

    const cancelEditing = () => {
        setEditingNoteId(null);
        setEditingNoteText("");
        setEditingNoteTags("");
    };

    const deleteNote = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }
        try {
            await notesAPI.delete(id);
            setNotes(notes.filter(note => note._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        try {
            await authAPI.logout();
        } catch (err) {
            console.error(err);
        }
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await notesAPI.getAll();
                if (Array.isArray(res)) {
                    setNotes(res);
                } else {
                    setError("Failed to load notes");
                }
            } catch (error) {
                if (error.message.includes('401')) {
                    navigate('/');
                } else {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotes();
    }, [navigate]);
    
    const allTags = useMemo(() => {
        const tagsSet = new Set();
        notes.forEach(note => {
            if (note.tags) {
                note.tags.forEach(tag => tagsSet.add(tag));
            }
        });
        return Array.from(tagsSet).sort();
    }, [notes]);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const searchMatch = note.text.toLowerCase().includes(searchQuery.toLowerCase());
            const tagMatch = selectedTag ? note.tags?.includes(selectedTag) : true;
            return searchMatch && tagMatch;
        });
    }, [notes, searchQuery, selectedTag]);
    
    

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-6xl flex justify-between items-center mb-12">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 drop-shadow-sm tracking-tight">
          My Notes
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl border-b-4 border-red-700 active:border-b-0 active:translate-y-1 shadow-lg transition-all"
        >Logout</button>
      </div>

      <div className="w-full max-w-6xl mb-8 p-6 bg-white rounded-2xl shadow-xl border-b-8 border-slate-200">
        <div className="flex gap-4">
            <input
              type="text"
              placeholder="What's on your mind?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handler() }}
              className="flex-1 bg-slate-100 text-slate-800 placeholder-slate-400 text-lg px-6 py-4 rounded-xl border-b-4 border-slate-300 focus:border-indigo-500 focus:outline-none transition-all"
            />
            <button
              onClick={handler}
              disabled={buttonLoading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white font-bold px-8 py-4 rounded-xl border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 shadow-lg transition-all"
            >
              {buttonLoading ? 'Adding...' : 'Add'}
            </button>
        </div>
        <input
            type="text"
            placeholder="Add tags, separated by commas..."
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handler() }}
            className="w-full mt-4 bg-slate-100 text-slate-800 placeholder-slate-400 text-base px-6 py-3 rounded-xl border-b-4 border-slate-300 focus:border-indigo-500 focus:outline-none transition-all"
        />
      </div>

      {error && (
        <div className="w-full max-w-6xl mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
          {error}
          <button onClick={() => setError('')} className="float-right font-bold">×</button>
        </div>
      )}

      <div className="w-full max-w-6xl mb-8">
        <div className="flex flex-wrap items-center gap-4">
            <input
                type="search"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-white text-slate-800 placeholder-slate-400 text-lg px-6 py-3 rounded-xl border-b-4 border-slate-300 focus:border-cyan-500 focus:outline-none shadow-lg transition-all"
            />
            <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setSelectedTag(null)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!selectedTag ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>All</button>
                {allTags.map(tag => (
                    <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${selectedTag === tag ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>
                        {tag}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-2xl font-bold text-slate-400 animate-pulse">Loading...</div>
      ) : (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredNotes.map((note) => (
            <li key={note._id} className="group relative bg-white p-6 rounded-2xl border-b-8 border-r-8 border-slate-200 hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-300 flex flex-col">
                {editingNoteId === note._id ? (
                    <div className="flex flex-col gap-4">
                        <textarea value={editingNoteText} onChange={(e) => setEditingNoteText(e.target.value)} className="w-full h-24 p-2 border rounded bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"></textarea>
                        <input type="text" value={editingNoteTags} onChange={(e) => setEditingNoteTags(e.target.value)} className="w-full p-2 border rounded bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Tags, comma separated" />
                        <div className="flex gap-2">
                            <button onClick={() => handleEditNote(note._id)} disabled={buttonLoading} className="flex-1 bg-green-500 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                              {buttonLoading ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={cancelEditing} className="flex-1 bg-slate-400 text-white px-4 py-2 rounded-lg hover:bg-slate-500">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-grow">
                            <span className="text-slate-700 text-lg font-medium break-words leading-relaxed block">{note.text}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                            <div className="flex flex-wrap gap-2">
                                {note.tags?.map(tag => <span key={tag} className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full capitalize">{tag}</span>)}
                            </div>
                            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditing(note)} className="p-2 rounded-lg hover:bg-indigo-100 transition-all duration-200"><img src={editicon} alt="edit" className="w-5 h-5 opacity-50 hover:opacity-100" /></button>
                            <button onClick={() => deleteNote(note._id)} className="p-2 rounded-lg hover:bg-red-100 transition-all duration-200"><img src={deleteicon} alt="delete" className="w-5 h-5 opacity-50 hover:opacity-100" /></button>
                        </div>
                    </>
                )}
            </li>
        ))}
      </ul>
      )}
    </div>
  )
}

export default Home
