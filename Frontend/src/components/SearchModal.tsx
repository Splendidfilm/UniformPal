import { useEffect, useState } from "react";
import { Trash2, Search, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import UniformDetailModal from './UniformDetailModal'


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
  const [selectedUniform, setSelectedUniform] = useState<Uniform | null>(null)

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("http://localhost:5000/uniforms")
        .then((res) => res.json())
        .then((data) => setUniforms(data))
        .catch((err) => console.error("Error fetching uniforms:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }, [isOpen]);

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
        `http://localhost:5000/delete-uniform/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setUniforms((prev) => prev.filter((u) => u.id !== id));
        setResults((prev) => prev.filter((u) => u.id !== id));
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
                    className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-3 flex flex-col group"
                    onClick={() => setSelectedUniform(r)}
                  >
                    {/* School Uniform */}
                    <div className="relative w-full h-44 overflow-hidden rounded-lg">
                      <img
                        src={`http://localhost:5000${r.uniformImage}`}
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
                            src={`http://localhost:5000${r.compoundImage}`}
                            alt={r.compoundWear}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <p className="mt-1">{r.compoundWear || "Compound"}</p>
                        </div>
                      )}
                      {r.churchImage && (
                        <div className="flex flex-col items-center text-xs text-gray-600">
                          <img
                            src={`http://localhost:5000${r.churchImage}`}
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
                      onClick={() => handleDelete(r.id)}
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



// import React, { useEffect, useState } from "react";
// import { Trash2, Search, Loader2 } from "lucide-react";
// // import { data } from "framer-motion/client";
// import { AnimatePresence, motion } from "framer-motion";

// interface Uniform {
//   id:string;
//   school: string;
//   uniformCombo: string;
//   uniformImage?: string;
//   schoolType:"primary" | "secondary"
//   compoundWear?:string
//   compoundImage?:string
//   churchWear?:string
//   churchImage?:string
// }

// function SearchModal({
//   isOpen,
//   onClose,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   const [query, setQuery] = useState("");
//   const [uniforms, setUniforms] = useState<Uniform[]>([]);
//   const [results, setResults] = useState<Uniform[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searched, setSearched]  = useState(false)
//   const [deleting, setDeleting] = useState<string | null>(null)

//   // const [selectedUniform, setSelectedUniform] = useState<Uniform | null>(null)
//   // const [favorites, setFavorites] = useState<string[]>(() => {
//   //   const saved = localStorage.getItem("favorites")
//   //   return saved ? JSON.parse(saved) : []
//   // })
//   // const [filterType, setFilterType] = useState<"all" | "primary" | "secondary">("all")
//   // const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

// useEffect(() => {
//   if (isOpen) {
//     setLoading(true)
//     fetch("http://localhost:5000/uniforms")
//     .then((res) => res.json())
//     .then((data) => setUniforms(data))
//     .catch((err) => console.error("Error fetching uniforms:", err))
//     .finally(() => setLoading(false))
//   }
// }, [isOpen])

//   useEffect(() => {
//     if (!isOpen ) {
//       setQuery("")
//       setResults([])
//       setSearched(false)
//     }
//   },[isOpen])


//   const handleSearch = () => {
//     setSearched(true)

//     if(!query.trim()){
//       setResults([])
//       return;
//     }

//     const found = uniforms.filter((u) =>
//       u.school.toLowerCase().includes(query.toLowerCase())
//     );
//     setResults(found);
//   }

//   // useEffect(() => {
//   //   const debounce = setTimeout(() => {
//   //     handleSearch();
//   //   }, 300); // 300ms debounce

//   //   return () => clearTimeout(debounce);
//   // }, [query]);

//   const handleDelete = async (id: string) =>{
//     if (!window.confirm(`Are you sure you want to delete the uniform for ${id}?`)) 
//       return;

//       setDeleting(id);
//       try{
// const response = await fetch(`http://localhost:5000/delete-uniform/${encodeURIComponent(id)}`,
// { method: "DELETE"}
// )

// if(response.ok){
//   setUniforms((prev) => prev.filter((u) => u.id !== id));
//   setResults((prev) => prev.filter((u) => u.id !== id));
// }else{
//   alert("Failed to delete uniform.")
// }
//   }catch(err){
//     console.error("Error deleting:",err)
//     alert("Error deleting uniform.")
//   }finally{
//     setDeleting(null)
//   }

//   }

//   // useEffect(() =>{
//   //   const found = uniforms.filter((u) =>u.school.toLowerCase().includes(query.toLowerCase())
//   //   )
//   //   setResults(found)
//   // },[query, uniforms])


//   if (!isOpen) return null;

//   return (
//     <AnimatePresence >  
//       <motion.div
//         key="modal"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}    
//       className="fixed inset-0 flex items-center justify-center z-40">
//       <motion.div
//       initial={{ scale: 0.8, opacity: 0, y: 50 }}
//       animate={{ scale: 1, opacity: 1 , y: 0 }}
//       exit={{ scale: 0.8, opacity: 0, y:50 }}
//       transition={{ duration:0.3, ease: "easeInOut" }}
//       className="bg-white p-6 rounded-lg shadow-2xl w-4/5 relative flex flex-col items-center h-5/6 justify-around">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-extrabold"
//         >
//           ✕
//         </button>
//         <div className="flex flex-col justify-center items-center w-11/12 h-10/12 transition-all">
//           {/* Search Input */}
//           <div className="flex w-full h-max ">
//             <input
//               type="text"
//               placeholder="Search for uniforms..."
//               className="border border-gray-300 rounded-full p-3 w-4/5 focus:ring-2 focus:ring-purple-500 outline-none focus:border-none transition-transform"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   setSearched(true)
//                   handleSearch();
//                 }
//               }}
//             />
//             <button
//               className="bg-purple-500 text-white rounded-lg p-3 ml-2 hover:opacity-95 flex items-center gap-1 active:scale-90 transition-all"
//               onClick={handleSearch}
//             >
//               <Search size={16} />
//             </button>
//           </div>


// {/* Results Section */}
// <div className="mt-6 flex justify-center items-start w-full h-full overflow-hidden">

//   {loading ? (
//     <div className="flex justify-center items-center h-full text-gray-500">
//       <Loader2 className="animate-spin mr-2" /> Loading uniforms...
//     </div>
//   ) : searched && results.length > 0 ? (
//     <motion.ul
//       layout
//       className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full h-full overflow-y-auto px-3 pb-6"
//     >
//       {results.map((r, i) => (
//         <motion.li
//           key={i}
//           layout
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 20 }}
//           transition={{ duration: 0.25 }}
//           className="relative bg-white border border-gray-200 rounded-2xl p-3 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex flex-col items-center text-center"
//         >
//           <div className="relative w-full h-40 overflow-hidden rounded-xl">
//             <img
//               src={`http://localhost:5000${r.uniformImage}`}
//               alt={r.school}
//               className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//             />
//           </div>

//           <div className="mt-3 w-full space-y-1">
//             <h3 className="font-semibold text-gray-800 text-base truncate">{r.school}</h3>
//             <p className="text-sm text-gray-500">Uniform Combo: {r.uniformCombo}</p>
//           </div>

//           {r.schoolType === "secondary" && (
//             <div className="mt-3 text-xs text-gray-600 space-y-2 w-full">
//               {r.compoundImage && (
//                 <div>
//                   <p className="font-medium text-gray-700 mb-1">Compound Wear:</p>
//                   <p>{r.compoundWear}</p>
//                   <img
//                     src={`http://localhost:5000${r.compoundImage}`}
//                     alt={r.compoundWear}
//                     className="w-full h-56 object-cover rounded-md"
//                   />
//                 </div>
//               )}
//               {r.churchImage && (
//                 <div>
//                   <p className="font-medium text-base text-gray-700 mb-1">Church Wear:</p>
//                   <p>{r.churchWear}</p>
//                   <img
//                     src={`http://localhost:5000${r.churchImage}`}
//                     alt={r.churchWear}
//                     className="w-full h-56 object-cover rounded-md"
//                   />
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Delete Button */}
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => handleDelete(r.id)}
//             disabled={deleting === r.id}
//             className={`absolute top-3 right-3 transition-all rounded-full justify-center items-center flex w-8 h-8 
//               ${deleting === r.id
//                 ? "bg-gray-200 cursor-not-allowed"
//                 : "bg-red-100 hover:bg-red-200 active:bg-red-300"
//             }`}>
//             {deleting === r.id ? (
//               <Loader2 className="animate-spin text-red-600" size={16} />
//             ) : (
//               <Trash2 size={16} className="text-red-600" />
//             )}
//           </motion.button>
//         </motion.li>
//       ))}
//     </motion.ul>
//   ) : searched && results.length === 0 ? (
//     <p className="text-gray-500 text-center mt-10">No matching uniforms found.</p>
//   ) : (
//     <p className="text-gray-400 text-center mt-10">
//       Type a school name to begin your search.
//     </p>
//   )}
// </div>

//         </div>
//       </motion.div>
//     </motion.div>
//     </AnimatePresence>
//   );
// }

// export default SearchModal;
