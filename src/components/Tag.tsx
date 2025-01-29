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
          ? "bg-indigo-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {name}
    </button>
  );
}
