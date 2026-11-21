import axios from "axios";
import { useState, useEffect } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import Loader from "./Loader";

interface Meaning{
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
}
interface WordData{
    word:string,
    meanings:Meaning[],
    phonetic?: string;
}
const Dictionary = () => {
  const [word, setWord] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WordData| null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const[loading,setLoading] = useState<boolean>(false)
  const[showHistory,setShowHistory] = useState<boolean>(false)

  // Load history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("wordHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const fetchDefinition = async () => {
    if (!word.trim()) return;
    try {
      setError(null);
      setLoading(true)
      const { data } = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      setResult(data[0]);

      // Update history (avoid duplicates)
      if (!history.includes(word)) {
        const newHistory = [word, ...history].slice(0, 10); // Limit to 10 items
        setHistory(newHistory);
        localStorage.setItem("wordHistory", JSON.stringify(newHistory));
      }
    } catch (err) {
      setResult(null);
      setError("Word not found, try another word.");

    }finally{
        setLoading(false)
    }
  };

  // Clear search history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("wordHistory");
  };

  return (
    <div className="max-w-md md:w-[50%] mx-auto mt-16 p-6 bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-lg">
      {/* Search Input */}
      <div className="flex items-center border-b-2 pb-2">
        <input
          type="text"
          placeholder="Search a word..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchDefinition()}
          className="w-full p-2 outline-none"
        />
        <button className="ml-3 text-blue-500" onClick={fetchDefinition}>
          <FaSearch size={20} />
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-500">{error}</p>}
        {loading && <Loader/>}
      {/* Search History */}
      {history.length > 0 && (
        <div className="mt-4 bg-gray-100 dark:bg-gray-500 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
           
            <h3 className="font-semibold cursor-pointer" onClick={()=>setShowHistory(!showHistory)}>Search History</h3>
            <button onClick={clearHistory} className="text-red-500 text-sm">
              <FaTrash />
            </button>
          </div>
          <ul className={` pl-4 ${showHistory?"list-disc" :"hidden"}`}>
            {history.map((item, index) => (
              <li
                key={index}
                className="cursor-pointer text-blue-500 hover:underline"
                onClick={() => setWord(item)} 
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Word Definition */}
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">{result.word}</h2>
          <p className="italic text-gray-500">{result.phonetic}</p>
          {result.meanings.map((meaning, index) => (
            <div key={index} className="mt-2">
              <h3 className="font-semibold">{meaning.partOfSpeech}</h3>
              <p>{meaning.definitions[0].definition}</p>
              {meaning.definitions[0].example && (
                <p className="text-gray-600">
                  Example: {meaning.definitions[0].example}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dictionary;
