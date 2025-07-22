const NoteCard = ({ note }) => {
  const date = note.created ? new Date(note.created).toLocaleString() : "Just now";

  return (
    <div className="bg-gray-900 border border-gray-800 text-white max-w-2xl w-full mx-auto rounded-xl shadow-lg p-4 transition hover:shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-blue-400">{note.title}</h3>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed tracking-wide">
        {note.body}
      </div>
    </div>
  );
};

export default NoteCard;
