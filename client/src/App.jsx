import { useState } from "react";
import api from "./axios-client";

const App = () => {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchResults([]);
    setNotFound(false);
    setError(false);

    try {
      const response = await api.post("/search", {
        email,
        number,
      });
      response.data.length === 0 && setNotFound(true);
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      // статус ответа при отклоненном предыдущем запросе
      if (error.response?.status === 409) return;

      setLoading(false);
      setError(error.response?.data.message);
    }
  };

  const handleNumberChange = (e) => {
    const maskedValue = formatNumber(e.target.value);
    setNumber(maskedValue);
  };

  const formatNumber = (inputValue) => {
    const numericValue = inputValue.replace(/\D/g, ""); // Оставляем только цифры

    // удаление символа
    if (inputValue.length < number.length) {
      // Удаляем цифру вместе с сиволом "-"
      if (number[number.length - 2] === "-") return number.slice(0, -2);
      // удаляем цифруы
      else return number.slice(0, -1);
    }

    let maskedValue = "";
    if (numericValue.length <= 2) maskedValue = numericValue;
    else if (numericValue.length > 2 && numericValue.length <= 4)
      maskedValue = `${numericValue.slice(0, 2)}-${numericValue.slice(
        2,
        numericValue.length
      )}`;
    else if (numericValue.length > 4)
      maskedValue = `${numericValue.slice(0, 2)}-${numericValue.slice(
        2,
        4
      )}-${numericValue.slice(4, numericValue.length)}`;

    return maskedValue.slice(0, 8); // Устанавливаем максимальную длину ввода в 99-99-99
  };

  return (
    <div className="p-5">
      <form className="border-b flex gap-5 pb-5 mb-5" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="youremail@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-1 border rounded"
        />
        <input
          type="text"
          placeholder="99-99-99"
          value={number}
          onChange={handleNumberChange}
          // pattern="\d{2}-\d{2}-\d{2}"
          title="XX-XX-XX"
          className="p-1 border rounded"
        />
        <button
          className="py-1 px-2 border rounded hover:bg-neutral-400 hover:text-white"
          type="submit"
        >
          Submit
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {notFound && <p>Not found</p>}
      {error && <p className="text-red-500">{error}</p>}
      {searchResults.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                {index + 1}. Email: {result.email}, Number: {result.number}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
