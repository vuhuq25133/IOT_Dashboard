export default function Header() {
  return (
    <div className="flex items-center justify-between w-full">
      <h1 className="text-lg font-semibold text-white-800 tracking-wide">
        IOT Dashboard
      </h1>
      <div className="flex items-center gap-3">
        <a
          href="http://localhost:5000/api-docs"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium text-white hover:bg-pink-500 rounded-lg border border-pink-500 transition"
        >
          API Docs
        </a>
        <a
          href="https://github.com/VUHUQ25133/IOT_Dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium text-white hover:bg-pink-500 rounded-lg border border-pink-500 transition"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
