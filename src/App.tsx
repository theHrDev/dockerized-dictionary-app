import { useState, useEffect } from "react";
import Dictionary from "./component/Dictionary";
import { FaMoon, FaSun } from "react-icons/fa";

function App() {
  const [mode, setMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "true"; // Load from localStorage
  });

  // Apply dark mode class to the <html> tag
  useEffect(() => {
    if (mode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(mode)); // Save mode
  }, [mode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 relative">
      {/* Toggle Button - Positioned at the Top-Right */}
      <div
        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg cursor-pointer"
        onClick={() => setMode(!mode)}
      >
        {mode ? (
          <FaSun className="text-yellow-500" />
        ) : (
          <FaMoon className="text-gray-600" />
        )}
      </div>

      <div className="flex flex-col">
        <Dictionary />
      </div>
    </div>
  );
}

export default App;
