import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";

const Home = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) return (window.location.href = "/auth");
      setUser(currentUser);

      const q = query(collection(db, "notes"), where("uid", "==", currentUser.uid));
      onSnapshot(q, (snapshot) => {
        setNotes(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
    });
  }, []);

  const handleAddOrUpdateNote = async () => {
    if (!title.trim() || !body.trim()) return;

    if (editingNoteId) {
      await updateDoc(doc(db, "notes", editingNoteId), { title, body });
      setEditingNoteId(null);
    } else {
      await addDoc(collection(db, "notes"), {
        title,
        body,
        uid: user.uid,
        created: Date.now(),
        important: false,
      });
    }

    setTitle("");
    setBody("");
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setBody(note.body);
    setEditingNoteId(note.id);
  };

  const toggleImportant = async (note) => {
    await updateDoc(doc(db, "notes", note.id), { important: !note.important });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-[#1e1b2e] p-6 rounded-2xl shadow-lg mb-6 border border-indigo-800">
          <h2 className="text-2xl font-bold mb-4 text-violet-300">📝 {editingNoteId ? "Edit Note" : "New Note"}</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 px-4 py-2 bg-black border border-violet-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <textarea
            placeholder="Write your thoughts..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="5"
            className="w-full px-4 py-2 bg-black border border-violet-700 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={handleAddOrUpdateNote}
              className="bg-gradient-to-tr from-violet-600 to-indigo-600 px-6 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition"
            >
              {editingNoteId ? "✏️ Update" : "➕ Save"}
            </button>
            <button
              className="bg-purple-800 px-4 py-2 rounded-xl text-white hover:bg-purple-900"
              onClick={() => alert("AI analyzer coming soon!")}
            >
              ⚙️ AI Analyze
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-purple-300 mb-4">🗂 Your Notes</h3>
        <div className="space-y-4">
          {notes.length === 0 ? (
            <p className="text-gray-500">No notes yet. Start writing!</p>
          ) : (
            notes
              .sort((a, b) => b.created - a.created)
              .map((note) => (
                <div
                  key={note.id}
                  className={`bg-[#1e1b2e] p-4 rounded-xl border ${
                    note.important ? "border-yellow-400" : "border-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold text-white">{note.title}</h4>
                    <div className="space-x-2">
                      <button onClick={() => handleEdit(note)} title="Edit">✏️</button>
                      <button onClick={() => handleDelete(note.id)} title="Delete">🗑️</button>
                      <button onClick={() => toggleImportant(note)} title="Mark Important">
                        {note.important ? "⭐" : "☆"}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300">{note.body}</p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
