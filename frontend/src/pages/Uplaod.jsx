import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, X } from "lucide-react"; // Added X icon for remove button
import axios from "axios";

export default function Upload() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("append");
  const [files, setFiles] = useState([]); // array of File objects selected
  const navigate = useNavigate();

  // Handle file selection; limit to max 3 files
  const handleFileSelect = (e) => {
    setError("");

    const selectedFiles = Array.from(e.target.files);

    // Filter to only csv files, ignoring others
    const csvFiles = selectedFiles.filter((file) =>
      file.name.toLowerCase().endsWith(".csv")
    );

    if (csvFiles.length === 0) {
      setError("❌ Please select at least one .csv file.");
      return;
    }

    // Combine existing files and new files, but max 3 total
    const combinedFiles = [...files, ...csvFiles].slice(0, 3);

    // Check for duplicate filenames in the combined list
    const uniqueFileNames = new Set(combinedFiles.map((f) => f.name.toLowerCase()));
    if (uniqueFileNames.size < combinedFiles.length) {
      // Duplicates found by filename
      if (
        !window.confirm(
          "Duplicate filenames detected in your selection. Do you want to proceed anyway?"
        )
      ) {
        return; // User cancelled adding duplicates
      }
    }

    setFiles(combinedFiles);
    // Reset file input so same file can be re-selected if removed
    e.target.value = null;
  };

  // Remove a file from queue by index
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle uploading all files in queue
  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one CSV file to upload.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await axios.post(`/api/trades/upload?mode=${mode}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 && res.data.success) {
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Upload failed. Please try again.");
      }
    } catch (err) {
      setError("⚠️ Failed to upload files. Server error or invalid format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center transition hover:shadow-2xl">
        <UploadCloud className="mx-auto text-black mb-4" size={48} />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Upload your portfolio</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Please upload <span className="font-medium">up to 3 .csv</span> files at once.
        </p>

        {/* Upload Mode Selection */}
        <label htmlFor="uploadMode" className="block text-left mb-2 font-medium text-gray-700">
          Upload Mode:
        </label>
        <select
          id="uploadMode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          disabled={loading}
          className="w-full mb-6 rounded border border-gray-300 p-2"
        >
          <option value="append">Append (add new trades)</option>
          <option value="overwrite">Overwrite (replace all trades)</option>
        </select>

        {/* File input - hidden */}
        <input
          id="csvUpload"
          name="files"
          type="file"
          accept=".csv"
          multiple
          onChange={handleFileSelect}
          disabled={loading || files.length >= 3}
          className="hidden"
          data-testid="file-input"
        />

        {/* Choose Files Button */}
        <label
          htmlFor="csvUpload"
          className={`cursor-pointer inline-block bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition ${
            loading || files.length >= 3 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : files.length >= 3 ? "Max 3 files selected" : "Choose Files"}
        </label>

        {/* Show queued files */}
        {files.length > 0 && (
          <div className="mt-6 text-left max-h-48 overflow-y-auto border border-gray-200 rounded p-3">
            <h2 className="font-semibold mb-2 text-gray-700">Files to Upload ({files.length}/3):</h2>
            <ul className="space-y-1">
              {files.map((file, idx) => (
                <li
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(idx)}
                    type="button"
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label={`Remove file ${file.name}`}
                  >
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="mt-4 text-red-600 font-medium text-sm">{error}</div>}

        {/* Upload All Button */}
        <button
          onClick={handleUpload}
          disabled={loading || files.length === 0}
          className={`mt-6 w-full py-2 px-4 rounded text-white ${
            loading || files.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } font-semibold transition`}
        >
          {loading ? "Uploading..." : "Upload All Files"}
        </button>

        <p className="mt-4 text-xs text-gray-400">Accepted file format: .csv</p>
      </div>
    </div>
  );
}
