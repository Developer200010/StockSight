import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import axios from "axios";

export default function Upload() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isCsv = file.name.endsWith(".csv");
    if (!isCsv) {
      setError("❌ Only .csv files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/api/trades/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        navigate("/dashboard");
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (err) {
      setError("⚠️ Failed to upload file. Server error or invalid format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center transition hover:shadow-2xl">
        <UploadCloud className="mx-auto text-black mb-4" size={48} />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Upload your portfolio
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          Please upload a <span className="font-medium">.csv</span> file only.
        </p>

        <label
          htmlFor="csvUpload"
          className="cursor-pointer inline-block bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
        >
          {loading ? "Uploading..." : "Choose File"}
        </label>
        <input
          id="csvUpload"
          type="file"
          accept=".csv"
          onChange={handleUpload}
          disabled={loading}
          className="hidden"
        />

        {error && (
          <div className="mt-4 text-red-600 font-medium text-sm">{error}</div>
        )}

        <p className="mt-4 text-xs text-gray-400">Accepted file format: .csv</p>
      </div>
    </div>
  );
}
