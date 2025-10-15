import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";

function AddUniformModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [schoolType, setSchoolType] = useState<"primary" | "secondary" | "">("");
  const [school, setSchool] = useState("");
  const [uniformCombo, setUniformCombo] = useState("");
  const [compoundWear, setCompoundWear] = useState("");
  const [churchWear, setChurchWear] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const [RequiredMessage, setRequiredMessage] = useState<string | null>(null);

  // Image States
  const [uniformImage, setUniformImage] = useState<File | null>(null);
  const [compoundImage, setCompoundImage] = useState<File | null>(null);
  const [churchImage, setChurchImage] = useState<File | null>(null);
  const [uniformPreview, setUniformPreview] = useState<string | null>(null);
  const [compoundPreview, setCompoundPreview] = useState<string | null>(null);
  const [churchPreview, setChurchPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const reset = () => {
    setChurchImage(null);
    setUniformImage(null);
    setCompoundImage(null);
    setChurchPreview(null);
    setCompoundPreview(null);
    setUniformPreview(null);
    setChurchWear("");
    setSchool("");
    setCompoundWear("");
    setSchoolType("");
    setUniformCombo("");
  };

  const Required = (mess: string) => {
    setRequiredMessage(mess);
    setTimeout(() => setRequiredMessage(null), 2000);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "uniform" | "compound" | "church"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "uniform") {
        setUniformImage(file);
        setUniformPreview(reader.result as string);
      } else if (type === "compound") {
        setCompoundImage(file);
        setCompoundPreview(reader.result as string);
      } else {
        setChurchImage(file);
        setChurchPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!school || !uniformCombo) {
      Required("Please fill in school name and uniform combination.");
      return;
    }

    const formData = new FormData();
    formData.append("school", school);
    formData.append("schoolType", schoolType);
    formData.append("uniformCombo", uniformCombo);
    if (uniformImage) formData.append("uniformImage", uniformImage);
    if (compoundWear) formData.append("compoundWear", compoundWear);
    if (churchWear) formData.append("churchWear", churchWear);
    if (compoundImage) formData.append("compoundImage", compoundImage);
    if (churchImage) formData.append("churchImage", churchImage);

    try {
      const response = await fetch("http://localhost:5000/add-uniform", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("✅ Uniform added successfully!");
        setTimeout(() => {
          reset();
          setSuccessMessage(null);
          onClose();
        }, 1500);
      } else {
        setFailedMessage(result.message || "❌ Failed to add uniform.");
        setTimeout(() => setFailedMessage(null), 2000);
      }
    } catch (err) {
      console.error(err);
      setFailedMessage("Network error. Could not add uniform.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200/40 backdrop-blur-md z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-white w-11/12 md:w-3/4 lg:w-2/3 rounded-2xl shadow-xl border border-gray-100 overflow-y-auto max-h-[90vh] p-6 md:p-10 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-all"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-700 text-center mb-6">
          Add New <span className="text-purple-600">Uniform</span>
        </h2>

        {/* School Type Toggle */}
        <div className="relative bg-gray-100 rounded-full w-72 h-12 flex items-center justify-between px-2 mx-auto mb-6">
          <motion.div
            layout
            className="absolute top-1 bottom-1 rounded-full bg-purple-500 transition-all"
            animate={{
              left:
                schoolType === "primary"
                  ? 4
                  : schoolType === "secondary"
                  ? "50%"
                  : 4,
              width: schoolType ? "48%" : "0%",
            }}
          ></motion.div>
          <button
            onClick={() => setSchoolType("primary")}
            className={`z-10 w-1/2 py-2 text-center font-medium transition-all ${
              schoolType === "primary" ? "text-white" : "text-gray-500"
            }`}
          >
            Primary
          </button>
          <button
            onClick={() => setSchoolType("secondary")}
            className={`z-10 w-1/2 py-2 text-center font-medium transition-all ${
              schoolType === "secondary" ? "text-white" : "text-gray-500"
            }`}
          >
            Secondary
          </button>
        </div>

        {schoolType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-5"
          >
            {/* School Info Inputs */}
            <input
              type="text"
              placeholder="School Name"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
            />

            <input
              type="text"
              placeholder="Uniform Combination"
              value={uniformCombo}
              onChange={(e) => setUniformCombo(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
            />

            {/* Uniform Upload */}
            <label className="relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer hover:border-purple-400 transition-all p-4">
              {uniformPreview ? (
                <img
                  src={uniformPreview}
                  alt="Uniform Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-gray-400 text-sm">Upload Uniform</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "uniform")}
                className="hidden"
              />
            </label>

            {/* Secondary School Extras */}
            {schoolType === "secondary" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {[
                  {
                    label: "Compound Wear",
                    value: compoundWear,
                    setter: setCompoundWear,
                    preview: compoundPreview,
                    type: "compound",
                  },
                  {
                    label: "Church Wear",
                    value: churchWear,
                    setter: setChurchWear,
                    preview: churchPreview,
                    type: "church",
                  },
                ].map(({ label, value, setter, preview, type }) => (
                  <div key={label} className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder={`Enter ${label}`}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                    <label className="relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer hover:border-purple-400 transition-all p-4">
                      {preview ? (
                        <img
                          src={preview}
                          alt={`${label} Preview`}
                          className="w-full h-56 object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400 mb-2" />
                          <span className="text-gray-400 text-sm">
                            Upload {label}
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(e, type as "compound" | "church")
                        }
                        className="hidden"
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Save Button */}
        <div className="w-full flex justify-center mt-6">
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-10 py-3 rounded-full font-semibold hover:bg-purple-700 active:scale-95 transition-all"
          >
            Save Uniform
          </button>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-10 bg-green-500 text-white px-6 py-3 rounded-full shadow-md font-medium"
            >
              {successMessage}
            </motion.div>
          )}

          {failedMessage && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-10 bg-red-500 text-white px-6 py-3 rounded-full shadow-md font-medium"
            >
              {failedMessage}
            </motion.div>
          )}

          {RequiredMessage && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-20 bg-orange-500 text-white px-6 py-3 rounded-full shadow-md font-medium"
            >
              {RequiredMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default AddUniformModal;



// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Upload } from "lucide-react";

// function AddUniformModal({
//   isOpen,
//   onClose,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   const [schoolType, setSchoolType] = useState<"primary" | "secondary" | "">("");
//   const [school, setSchool] = useState("");
//   const [uniformCombo, setUniformCombo] = useState("");
//   const [compoundWear, setCompoundWear] = useState("");
//   const [churchWear, setChurchWear] = useState("");
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [failedMessage, setFailedMessage] = useState<string | null>(null);
//   const [RequiredMessage, setRequiredMessage] = useState<string | null>(null);


//   // Images
//   const [uniformImage, setUniformImage] = useState<File | null>(null);
//   const [compoundImage, setCompoundImage] = useState<File | null>(null);
//   const [churchImage, setChurchImage] = useState<File | null>(null);

//   const [uniformPreview, setUniformPreview] = useState<string | null>(null);
//   const [compoundPreview, setCompoundPreview] = useState<string | null>(null);
//   const [churchPreview, setChurchPreview] = useState<string | null>(null);

//   if (!isOpen) return null;

//   function reset(){
//     setChurchImage(null)
//     setUniformImage(null)
//     setCompoundImage(null)

//     setChurchPreview(null)
//     setCompoundPreview(null)
//     setUniformPreview(null)

//     setChurchWear("")
//     setSchool("")
//     setCompoundWear("")
//     setSchoolType("")
//     setUniformCombo("")
//   }

//   function Required(mess: string){
//       setRequiredMessage(mess)
//       setTimeout(() =>{
//         setRequiredMessage(null)
//       },1500)
//   }

//   const handleImageUpload = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     type: "uniform" | "compound" | "church"
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       if (type === "uniform") {
//         setUniformImage(file);
//         setUniformPreview(reader.result as string);
//       } else if (type === "compound") {
//         setCompoundImage(file);
//         setCompoundPreview(reader.result as string);
//       } else {
//         setChurchImage(file);
//         setChurchPreview(reader.result as string);
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSave = async () => {
//     if (!school || !uniformCombo) {
//       Required("Please fill in school name and uniform combination.")
//       return;
//     }

//     const formData = new FormData();
//     formData.append("school", school);
//     formData.append("schoolType", schoolType);
//     formData.append("uniformCombo", uniformCombo);
//     if (uniformImage) formData.append("uniformImage", uniformImage);
//     if (compoundWear) formData.append("compoundWear", compoundWear);
//     if (churchWear) formData.append("churchWear", churchWear);
//     if (compoundImage) formData.append("compoundImage", compoundImage);
//     if (churchImage) formData.append("churchImage", churchImage);

//     try {
//       const response = await fetch("http://localhost:5000/add-uniform", {
//         method: "POST",
//         body: formData,
//       });
//       const result = await response.json();

//       if (response.ok) {
//         setSuccessMessage("✅ Uniform added successfully!");
//         setTimeout(() => {
//           reset()
//           setSuccessMessage(null);
//           onClose();
//         }, 1500);
//       } else {
//         setFailedMessage( result.message || "❌ Failed to add uniform.");
//         setTimeout(() => setFailedMessage(null), 2000);
//       }
//     } catch (err) {
//       console.error(err);
//       setFailedMessage("Network error. Could not add uniform.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         className="bg-white p-8 rounded-3xl shadow-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto relative flex flex-col items-center gap-6"
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
//         >
//           ✕
//         </button>

//         <h2 className="text-2xl font-bold text-purple-600 mt-2">
//           Add Uniform
//         </h2>

//         {/* Type Selector */}
//         <div className="relative bg-gray-100 rounded-full w-72 h-12 flex items-center justify-between px-2">
//           <motion.div
//             layout
//             className="absolute top-1 bottom-1 rounded-full bg-purple-500 transition-all py-3"
//             animate={{
//               left:
//                 schoolType === "primary"
//                   ? 2
//                   : schoolType === "secondary"
//                   ? "50%"
//                   : "2",
//               width: "48%",
//             }}
//           ></motion.div>
//           <button
//             onClick={() => setSchoolType("primary")}
//             className={`z-10 w-1/2 py-3 text-center font-medium transition-all ${
//               schoolType === "primary" ? "text-white" : "text-gray-500"
//             }`}
//           >
//             Primary
//           </button>
//           <button
//             onClick={() => setSchoolType("secondary")}
//             className={`z-10 w-1/2 py-3 text-center font-medium transition-all ${
//               schoolType === "secondary" ? "text-white" : "text-gray-500"
//             }`}
//           >
//             Secondary
//           </button>
//         </div>

//         {schoolType && (
//           <>
//             <input
//               type="text"
//               placeholder="School Name"
//               value={school}
//               onChange={(e) => setSchool(e.target.value)}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
//             />

//             <input
//               type="text"
//               placeholder="Uniform Combination"
//               value={uniformCombo}
//               onChange={(e) => setUniformCombo(e.target.value)}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
//             />

//             <label className="relative flex flex-col items-center justify-center w-11/12  border-2 border-dashed rounded-lg cursor-pointer hover:border-purple-400 transition-all mt-3">
//               {uniformPreview ? (
//                 <img
//                   src={uniformPreview}
//                   alt="Uniform Preview"
//                   className="w-full h-full object-cover rounded-lg"
//                 />
//               ) : (
//                 <>
//                   <Upload className="w-10 h-10 text-gray-400 mb-2" />
//                   <span className="text-gray-400 text-sm">
//                     Upload Uniform
//                   </span>
//                 </>
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleImageUpload(e, "uniform")}
//                 className="hidden"
//               />
//             </label>

//             {/* Secondary-specific */}
//             {schoolType === "secondary" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
//                 {[ 
//                   {
//                     label: "Compound Wear",
//                     value: compoundWear,
//                     setter: setCompoundWear,
//                     preview: compoundPreview,
//                     type: "compound",
//                   },
//                   {
//                     label: "Church Wear",
//                     value: churchWear,
//                     setter: setChurchWear,
//                     preview: churchPreview,
//                     type: "church",
//                   },
//                 ].map(({ label, value, setter, preview, type }) => (
//                   <div key={label}>
//                     <input
//                       type="text"
//                       placeholder={`Enter ${label}`}
//                       value={value}
//                       onChange={(e) => setter(e.target.value)}
//                       className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
//                     />
//                     <label className="relative flex flex-col items-center justify-center w-full  border-2 border-dashed rounded-lg cursor-pointer hover:border-purple-400 transition-all mt-3">
//                       {preview ? (
//                         <img
//                           src={preview}
//                           alt={`${label} Preview`}
//                           className="w-full h-full object-cover rounded-lg"
//                         />
//                       ) : (
//                         <>
//                           <Upload className="w-10 h-10 text-gray-400 mb-2" />
//                           <span className="text-gray-400 text-sm">
//                             Upload {label}
//                           </span>
//                         </>
//                       )}
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) =>
//                           handleImageUpload(
//                             e,
//                             type as "compound" | "church"
//                           )
//                         }
//                         className="hidden"
//                       />
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}

//         <button
//           onClick={handleSave}
//           className="bg-purple-600 text-white px-10 py-2 rounded-full font-medium hover:bg-purple-700 active:scale-95 transition-all"
//         >
//           Save
//         </button>

//         {successMessage && (
//           <motion.div
//         initial={{ scale: 0.9, opacity:0, y: 20 }}
//         animate={{ scale:1, opacity:1 , y: 0 }}
//         exit={{ scale:0.8, opacity: 0, y:-20 }}
//           className="fixed top-10 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-medium z-50">
//             {successMessage}
//           </motion.div>
//         )}

//         {failedMessage && (
//           <motion.div
//         initial={{ scale: 0.9, opacity:0, y: 20 }}
//         animate={{ scale:1, opacity:1 , y: 0 }}
//         exit={{ scale:0.8, opacity: 0, y:-20 }}
//           className="fixed top-10 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg font-medium z-50">
//             {failedMessage}
//           </motion.div>
//         )}
//       </motion.div>

//       {RequiredMessage && (
//         <motion.div 
//         initial={{ scale: 0.9, opacity:0, y: 20 }}
//         animate={{ scale:1, opacity:1 , y: 0 }}
//         exit={{ scale:0.8, opacity: 0, y:-20 }}
//         className="fixed top-20 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg font-medium z-50" >
//           {RequiredMessage}
//         </motion.div>
//       )}
//     </div>
//   );
// }

// export default AddUniformModal;
