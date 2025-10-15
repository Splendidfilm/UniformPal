import Header from "./components/Header";
import Nav from "./components/Nav";
import UniformsCont from "./components/UniformsCont";
function App() {
  return (
    <div className="flex flex-col items-center justify-around ">
      <Nav />
      <div id="home" className="w-full">
        <Header />
      </div>

      <h1 className="text-xl mb-6 font-medium text-gray-800">Uniforms</h1>

      <div id="uniforms" className="w-full mt-10">
        <UniformsCont />
      </div>
    </div>
  );
}

export default App;
