import Converter from "./components/Converter";

function App() {

  return (
    <div className="flex h-screen items-center justify-center bg-[url('/src/assets/stock-image.png')] bg-cover bg-center">
      <div className="w-full max-w-lg mx-auto my-auto bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h3 className="text-3xl font-bold mb-8 text-gray-800">
          Currency Converter
        </h3>
        <Converter />
      </div>
    </div>
  );
}

export default App;
