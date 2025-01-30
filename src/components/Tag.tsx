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
          ? "bg-neutral-500 text-white"
          : "bg-neutral-200 text-neutral-700 hover:bg-gray-300"
      }`}
    >
      {name}
    </button>
  );
}
