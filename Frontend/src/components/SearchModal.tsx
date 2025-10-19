import { useEffect, useState } from "react";
import { Trash2, Search, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import UniformDetailModal from "./UniformDetailModal";
import { API_BASE_URL } from "../config";

interface Uniform {
  id: string;
  school: string;
  uniformCombo: string;
  uniformImage?: string;
  schoolType: "primary" | "secondary";
  compoundWear?: string;
  compoundImage?: string;
  churchWear?: string;
  churchImage?: string;
}

function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [uniforms, setUniforms] = useState<Uniform[]>([]);
  const [results, setResults] = useState<Uniform[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedUniform, setSelectedUniform] = useState<Uniform | null>(null);

  // 🔹 Fetch all uniforms when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`${API_BASE_URL}/uniforms`)
        .then((res) => res.json())
        .then((data) => setUniforms(data))
        .catch((err) => console.error("Error fetching uniforms:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  // 🔹 Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSearched(false);
      setSelectedUniform(null);
    }
  }, [isOpen]);

  // 🔹 Handle search
  const handleSearch = () => {
    setSearched(true);
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const found = uniforms.filter((u) =>
      u.school.toLowerCase().includes(query.toLowerCase())
    );
    setResults(found);
  };

 
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this uniform?")) return;

    setDeleting(id);
    try {
      const response = await fetch(
        `${API_BASE_URL}/delete-uniform/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUniforms((prev) => prev.filter((u) => u.id !== id));
        setResults((prev) => prev.filter((u) => u.id !== id));
        if (selectedUniform?.id === id) setSelectedUniform(null);
        alert("🗑️ Uniform deleted successfully!");
      } else {
        alert("Failed to delete uniform.");
      }
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Error deleting uniform.");
    } finally {
      setDeleting(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-40 bg-black/30 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white p-6 rounded-2xl shadow-2xl w-11/12 md:w-4/5 h-[85vh] flex flex-col relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-red-500 font-extrabold text-lg"
          >
            ✕
          </button>

          {/* Search Input */}
          <div className="flex justify-center w-full mb-6">
            <input
              type="text"
              placeholder="Search for a school..."
              className="border border-gray-300 rounded-full p-3 w-4/5 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              onClick={handleSearch}
              className="bg-purple-600 text-white rounded-full p-3 ml-2 hover:bg-purple-700 active:scale-95 transition-all"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Results */}
          <div className="overflow-y-auto px-4 pb-6">
            {loading ? (
              <div className="flex justify-center items-center text-gray-500 py-10">
                <Loader2 className="animate-spin mr-2" /> Loading uniforms...
              </div>
            ) : searched && results.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {results.map((r) => (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.25 }}
                    className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-3 flex flex-col group cursor-pointer"
                    onClick={() => setSelectedUniform(r)}
                  >
                    {/* School Uniform */}
                    <div className="relative w-full h-44 overflow-hidden rounded-lg">
                      <img
                        src={`${API_BASE_URL}${r.uniformImage}`}
                        alt={r.school}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="mt-3 text-center space-y-1">
                      <h3 className="font-semibold text-gray-800 text-lg truncate">
                        {r.school}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Uniform Combo: {r.uniformCombo}
                      </p>
                      <p className="text-xs text-gray-400">
                        Type: {r.schoolType}
                      </p>
                    </div>

                    {/* Extra Images (Compound + Church Wear) */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {r.compoundImage && (
                        <div className="flex flex-col items-center text-xs text-gray-600">
                          <img
                            src={`${API_BASE_URL}${r.compoundImage}`}
                            alt={r.compoundWear}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <p className="mt-1">{r.compoundWear || "Compound"}</p>
                        </div>
                      )}
                      {r.churchImage && (
                        <div className="flex flex-col items-center text-xs text-gray-600">
                          <img
                            src={`${API_BASE_URL}${r.churchImage}`}
                            alt={r.churchWear}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <p className="mt-1">{r.churchWear || "Church"}</p>
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent modal from opening
                        handleDelete(r.id);
                      }}
                      disabled={deleting === r.id}
                      className={`absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full ${
                        deleting === r.id
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-red-100 hover:bg-red-200"
                      } transition-all`}
                    >
                      {deleting === r.id ? (
                        <Loader2 className="animate-spin text-red-600" size={16} />
                      ) : (
                        <Trash2 size={16} className="text-red-600" />
                      )}
                    </motion.button>
                  </motion.div>
                ))}

                {/* Uniform Details Modal */}
                <UniformDetailModal
                  uniform={selectedUniform}
                  onClose={() => setSelectedUniform(null)}
                  onDelete={handleDelete}
                />
              </motion.div>
            ) : searched && results.length === 0 ? (
              <p className="text-center text-gray-500 mt-12">
                No matching uniforms found 😕
              </p>
            ) : (
              <p className="text-center text-gray-400 mt-12">
                Type a school name to begin your search.
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SearchModal;
