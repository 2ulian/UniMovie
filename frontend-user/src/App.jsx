import logo from './assets/react.svg';

function App() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <img src={logo} alt="Logo" className="h-12 w-12 mr-4" />
          <h1 className="text-6xl font-bold text-primary">Hello Netphlix</h1>
        </div>
        <p className="text-xl text-gray-400">
          Frontend User - React + Tailwind 4.1
        </p>
      </div>
    </div>
  );
}
export default App;
