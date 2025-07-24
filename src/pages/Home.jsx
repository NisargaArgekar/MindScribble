import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  addDoc, collection, query, where,
  onSnapshot, deleteDoc, doc, updateDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";
import { Plus } from "lucide-react"; // optional icon lib

const Home = () => {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) return (window.location.href = "/auth");
      setUser(currentUser);
      const q = query(collection(db, "notes"), where("uid", "==", currentUser.uid));
      onSnapshot(q, (snapshot) =>
        setNotes(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
    });
  }, []);

  const handleAddOrUpdateNote = async () => {
    if (!title.trim() || !body.trim()) return;

    if (editingNoteId) {
      await updateDoc(doc(db, "notes", editingNoteId), { title, body });
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
    setEditingNoteId(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => await deleteDoc(doc(db, "notes", id));
  const handleEdit = (note) => {
    setTitle(note.title);
    setBody(note.body);
    setEditingNoteId(note.id);
    setShowForm(true);
  };
  const toggleImportant = async (note) =>
    await updateDoc(doc(db, "notes", note.id), { important: !note.important });

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Sidebar */}
        <aside className="hidden md:block col-span-1 bg-[#161320] border-r border-gray-800 h-full p-4">
          <h2 className="text-lg font-semibold text-purple-300 mb-4">📁 Folders</h2>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">📝 All Notes</li>
            <li className="hover:text-white cursor-pointer">⭐ Important</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="col-span-3 p-4 md:p-8 space-y-4">
          <h3 className="text-2xl font-bold text-violet-400">Your Notes</h3>

          {notes.length === 0 ? (
            <p className="text-gray-500">No notes yet. Click + to add!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.sort((a, b) => b.created - a.created).map((note) => (
                <div
                  key={note.id}
                  className={`bg-[#1e1b2e] p-4 rounded-2xl hover:shadow-lg border ${
                    note.important ? "border-yellow-400" : "border-transparent"
                  } transition`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-white truncate">{note.title}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(note)} title="Edit">✏️</button>
                      <button onClick={() => handleDelete(note.id)} title="Delete">🗑️</button>
                      <button onClick={() => toggleImportant(note)} title="Toggle Important">
                        {note.important ? "⭐" : "☆"}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{note.body}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating New Note Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-full p-4 shadow-xl hover:scale-105 transition"
      >
        <Plus />
      </button>

      {/* Modal / Pop-up */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1e1b2e] p-6 rounded-2xl shadow-2xl w-[90%] max-w-xl border border-indigo-800 space-y-3">
            <h2 className="text-xl font-bold text-violet-300 mb-2">
              {editingNoteId ? "Edit Note" : "New Note"}
            </h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-violet-700 rounded-xl text-white focus:ring-2 focus:ring-violet-500"
            />
            <textarea
              rows={5}
              placeholder="Write your note..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-violet-700 rounded-xl text-white resize-none focus:ring-2 focus:ring-violet-500"
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={handleAddOrUpdateNote}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl text-white font-semibold"
              >
                {editingNoteId ? "Update" : "Save"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingNoteId(null);
                  setTitle("");
                  setBody("");
                }}
                className="text-red-400 hover:text-red-500 underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
