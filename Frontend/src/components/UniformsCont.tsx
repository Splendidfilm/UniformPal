import { motion } from "framer-motion";
import { Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import UniformDetailModal from "./UniformDetailModal";

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

function UniformsCont() {
  const [uniforms, setUniforms] = useState<Uniform[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] =
    useState<"all" | "primary" | "secondary">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedUniform, setSelectedUniform] = useState<Uniform | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/uniforms")
      .then((res) => res.json())
      .then((data) => setUniforms(data))
      .catch((err) => console.error("Error fetching uniforms:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = uniforms
    .filter((u) => filterType === "all" || u.schoolType === filterType)
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.school.localeCompare(b.school)
        : b.school.localeCompare(a.school)
    );

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this uniform?")) return;

    setDeleting(id);
    try {
      const response = await fetch(`http://localhost:5000/delete-uniform/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUniforms((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Error deleting uniform.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="w-full px-6 md:px-12 py-10 bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-sm">
      {/* Filter + Sort Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-6xl mx-auto mb-8">
        <div className="flex gap-3 flex-wrap justify-center">
          {["all", "primary", "secondary"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filterType === type
                  ? "bg-purple-600 text-white shadow-md scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          Sort: {sortOrder === "asc" ? "A–Z" : "Z–A"}
        </button>
      </div>

      {/* Loading / Empty / Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-purple-500" size={28} />
          <p className="ml-2 text-gray-500">Loading uniforms...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No uniforms available 🥲</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {filtered.map((u) => (
            <motion.div
              layout
              key={u.id}
              onClick={() => setSelectedUniform(u)}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer group"
            >
              {/* Image */}
              <div className="relative w-full h-60 overflow-hidden">
                <img
                  src={`http://localhost:5000${u.uniformImage}`}
                  alt={u.school}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Text */}
              <div className="p-4 space-y-1">
                <h3 className="font-semibold text-gray-800 text-lg truncate">
                  {u.school}
                </h3>
                <p className="text-sm text-gray-600 truncate">{u.uniformCombo}</p>
                <p className="text-xs text-gray-500">
                  Type: <span className="capitalize">{u.schoolType}</span>
                </p>
              </div>

              {/* Delete Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(u.id);
                }}
                disabled={deleting === u.id}
                className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full ${
                  deleting === u.id
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-red-100 hover:bg-red-200"
                } transition-all`}
              >
                {deleting === u.id ? (
                  <Loader2 className="animate-spin text-red-600" size={16} />
                ) : (
                  <Trash2 size={16} className="text-red-600" />
                )}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Detail Modal */}
      <UniformDetailModal
        uniform={selectedUniform}
        onClose={() => setSelectedUniform(null)}
        onDelete={handleDelete}
      />
    </section>
  );
}

export default UniformsCont;



