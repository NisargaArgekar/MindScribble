const NoteCard = ({ note }) => {
  const date = note.created ? new Date(note.created).toLocaleString() : "Just now";

  return (
    <div className="bg-glass border border-white/10 shadow-purpleGlow rounded-2xl p-6 backdrop-blur-md transition hover:scale-[1.01] duration-300 max-w-2xl w-full mx-auto">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-neonPurple font-semibold text-xl">{note.title}</h3>
        <span className="text-xs text-softPurple">{date}</span>
      </div>
      <p className="text-softPurple text-sm whitespace-pre-wrap leading-relaxed tracking-wide">
        {note.body}
      </p>
    </div>
  );
};

export default NoteCard;
