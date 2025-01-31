interface TagProps {
  name: string;
  selected: boolean;
  onClick: () => void;
}

export default function Tag({ name, selected, onClick }: TagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        selected
          ? "bg-gradient-to-b from-green-600 to-green-700 text-white shadow-md"
          : "bg-white/10 text-white hover:bg-gray-300 opacity-70"
      }`}
    >
      {name}
    </button>
  );
}
