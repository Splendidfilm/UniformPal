import React, { useState } from "react";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";
import AddUniformModal from "./AddUniformModal";
import SearchModal from "./SearchModal";

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);

    const handleScroll =(id: string) =>{
      const section = document.getElementById(id)
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
      }
    }

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Links + CTA (Desktop) */}
        <div className="hidden md:flex items-center space-x-8">
          <a
          onClick={() => handleScroll("home")}
            href="#home"
            className="text-gray-700 font-medium hover:text-purple-600 transition-colors duration-200"
          >
            Home
          </a>
          <a
          onClick={() => handleScroll("uniforms")}
            href="#uniforms"
            className="text-gray-700 font-medium hover:text-purple-600 transition-colors duration-200"
          >
            Uniforms
          </a>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => {setAddModalOpen(true)}}
            className="px-5 py-2 rounded-full bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-all active:scale-95 opacity-95"
          >
            Add Uniform
          </button>
          <button
            onClick={() => {setSearchModalOpen(true)}}
            className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all active:scale-95 opacity-95"
          >
            Search
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Items */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200">
          <div className="px-6 py-4 space-y-4">
            <a
          onClick={() => handleScroll("home")}
              href="#home"
              className="block text-gray-700 font-medium hover:text-purple-600 transition-all active:scale-95 opacity-95"
            >
              Home
            </a>
            <a
          onClick={() => handleScroll("uniforms")}
              href="#uniforms"
              className="block text-gray-700 font-medium hover:text-purple-600 transition-all active:scale-95 opacity-95"
            >
              Uniforms
            </a>
            <div className="pt-4 border-t border-gray-200 space-y-2 transition-all">
              <button
                onClick={() => { setAddModalOpen(true)}}
                className="w-full px-4 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all active:scale-95 opacity-95"
              >
                Add Uniform
              </button>
              <button
                onClick={() => {setSearchModalOpen(true)}}
                className="w-full px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all active:scale-95 opacity-95"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      <AddUniformModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </nav>
  );
}

export default Nav;


// import React from "react";
// import Logo from "./Logo";
// import { Search, Plus, Menu } from "lucide-react";

// function Nav() {
//   return (
//     <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
//       <div className="flex items-center justify-between px-6 md:px-12 py-4">
//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <Logo />
//         </div>

//         {/* Middle Navigation (optional links) */}
//         <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
//           <a
//             href="#home"
//             className="hover:text-purple-600 transition-colors duration-200"
//           >
//             Home
//           </a>
//           <a
//             href="#uniforms"
//             className="hover:text-purple-600 transition-colors duration-200"
//           >
//             Uniforms
//           </a>
//           <a
//             href="#contact"
//             className="hover:text-purple-600 transition-colors duration-200"
//           >
//             Contact
//           </a>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-4">
//           <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md">
//             <Plus size={18} />
//             <span>Add</span>
//           </button>

//           <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 active:scale-95 transition-all">
//             <Search size={18} />
//             <span>Search</span>
//           </button>

//           {/* Mobile menu icon */}
//           <button className="sm:hidden p-2 rounded-md hover:bg-gray-100 transition">
//             <Menu size={22} />
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Nav;

// // import React from 'react'
// // import Logo from './Logo'
// // // import Search from './Search'

// // function Nav() {
// //   return (
// //     <div className='flex flex-row flex-wrap w-full justify-around bg-gray-50 items-center shadow-md' >
// //         <Logo/>
// //         {/* <div className='flex ' >
// //     <span className='flex items-center justify-center px-4 py-2  rounded-full bg-gray-300 cursor-pointer hover:opacity-50 transition-all m-4 active:scale-90'>
// //     <h1 className='text-center flex font-bold text-2xl '>+</h1>
// //     </span>
// //         </div> */}
// //         {/* <Search /> */}
// //     </div>
// //   )
// // }

// // export default Nav
