import { useNavigate } from "react-router-dom";
import InstructionCard from "../components/InstructionCard";

export default function Landing() {
  const navigate = useNavigate();

  const instructions = [
    { title: "Step 1", description: "Prepare your portfolio .csv file" },
    { title: "Step 2", description: "Upload the file on the next page" },
    { title: "Step 3", description: "See your holdings & trades in the dashboard" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl font-bold text-black mb-6 text-center">Welcome to Portfolio Tracker</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8 w-full max-w-5xl">
        {instructions.map((item, i) => (
          <InstructionCard key={i} title={item.title} description={item.description} />
        ))}
      </div>

      <button
        onClick={() => navigate("/upload")}
        className="bg-black text-white px-6 py-3 rounded-md text-lg hover:bg-gray-800 transition"
      >
        Start Now
      </button>
    </div>
  );
}
