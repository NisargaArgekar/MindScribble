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
      await updateDoc(doc(db, "notes", editingNoteId), { title, body }).then(() => {
        setEditingNoteId(null);
        setTitle("");
        setBody("");
      });
    } else {
      await addDoc(collection(db, "notes"), {
        title,
        body,
        uid: user.uid,
        created: Date.now(),
        important: false,
      });
      setTitle("");
      setBody("");
    }
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
    <div className="min-h-screen bg-radial-gradient text-white font-modern">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* New/Edit Note */}
        <div className="bg-glass border border-white/10 shadow-purpleGlow p-6 rounded-2xl backdrop-blur-md mb-8">
          <h2 className="text-2xl font-bold text-neonPurple mb-4">
            📝 {editingNoteId ? "Edit Note" : "New Note"}
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 px-4 py-2 bg-lightBlack border border-purple-800 text-softPurple rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <textarea
            placeholder="Write your thoughts..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="5"
            className="w-full px-4 py-2 bg-lightBlack border border-purple-800 text-softPurple rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex justify-between mt-4">
            <button
              onClick={handleAddOrUpdateNote}
              className="bg-gradient-to-tr from-purple-600 to-purple-800 px-6 py-2 rounded-xl text-white font-semibold shadow-purpleGlow hover:scale-105 transition"
            >
              {editingNoteId ? "✏️ Update" : "➕ Save"}
            </button>

            <button
              className="bg-purple-900 px-6 py-2 rounded-xl text-white hover:bg-purple-700 shadow-md transition"
              onClick={() => alert("AI analyzer coming soon!")}
            >
              ⚙️ AI Analyze
            </button>
          </div>

          {editingNoteId && (
            <button
              onClick={() => {
                setEditingNoteId(null);
                setTitle("");
                setBody("");
              }}
              className="mt-4 block text-sm text-red-400 hover:underline"
            >
              ❌ Cancel Edit
            </button>
          )}
        </div>

        {/* Notes List */}
        <h3 className="text-xl font-semibold text-softPurple mb-4">📚 Your Notes</h3>

        <div className="space-y-4">
          {notes.length === 0 ? (
            <p className="text-gray-500">No notes yet. Start writing!</p>
          ) : (
            notes
              .sort((a, b) => b.created - a.created)
              .map((note) => (
                <div
                  key={note.id}
                  className="bg-glass border border-white/10 shadow-purpleGlow p-5 rounded-2xl backdrop-blur-md transition hover:scale-[1.01]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold text-neonPurple">{note.title}</h4>
                    <div className="space-x-2 text-lg">
                      <button onClick={() => handleEdit(note)} title="Edit">✏️</button>
                      <button onClick={() => handleDelete(note.id)} title="Delete">🗑️</button>
                      <button onClick={() => toggleImportant(note)} title="Mark Important">
                        {note.important ? "⭐" : "☆"}
                      </button>
                    </div>
                  </div>
                  <p className="text-softPurple whitespace-pre-wrap">{note.body}</p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
