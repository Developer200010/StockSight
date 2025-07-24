export default function InstructionCard({ title, description }) {
  return (
    <div className="border border-gray-300 rounded-xl p-6 shadow hover:shadow-lg transition bg-white">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
