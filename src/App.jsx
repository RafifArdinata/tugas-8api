import { useState, useEffect } from "react";
import axios from "./Api/axios";
import "./index.css";

import {
  CloudRain,
  Cloud,
  Sun,
  CloudLightning,
  Search,
} from "lucide-react";

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("");
  const [input, setInput] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_KEY;


  const fetchWeather = (city, save = false) => {
    axios
      .get(`/weather?q=${city}&units=metric&appid=${API_KEY}`)
      .then((res) => {
        setData(res.data);
        setLocation(city);

        if (save) {
          localStorage.setItem("weatherData", JSON.stringify(res.data));
          localStorage.setItem("lastCity", city);
        }
      })
      .catch(() => {
        alert("Kota tidak ditemukan");
      });
  };


  useEffect(() => {
    const savedWeather = localStorage.getItem("weatherData");
    const savedCity = localStorage.getItem("lastCity");

    if (savedWeather && savedCity) {
      setData(JSON.parse(savedWeather));
      setLocation(savedCity);
    } else {
      fetchWeather("Jakarta");
    }
  }, []);


  const handleSearch = (e) => {
    if (e.key === "Enter" && input.trim()) {
      fetchWeather(input, true);
      setInput("");
    }
  };

  const weatherMain = data?.weather?.[0]?.main;
  const country = data?.sys?.country;
  const sunrise = data?.sys?.sunrise;
  const sunset = data?.sys?.sunset;

  const formatTime = (timestamp) => {
    if (!timestamp) return "--:--";

    const date = new Date(timestamp * 1000);

    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const WeatherIcon = () => {
    switch (weatherMain) {
      case "Rain":
        return <CloudRain size={160} />;
      case "Clouds":
        return <Cloud size={160} />;
      case "Thunderstorm":
        return <CloudLightning size={160} />;
      default:
        return <Sun size={160} />;
    }
  };

  const bgStyle = () => {
    switch (weatherMain) {
      case "Rain":
        return "from-blue-400 via-blue-500 to-blue-700";
      case "Thunderstorm":
        return "from-blue-600 via-indigo-700 to-blue-900";
      case "Clouds":
        return "from-sky-300 via-blue-400 to-blue-500";
      default:
        return "from-sky-200 via-sky-300 to-blue-400";
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center 
      bg-gradient-to-br ${bgStyle()} p-6`}
    >
      <div className="w-full max-w-sm rounded-[40px] p-6 text-white backdrop-blur-2xl bg-white/20 shadow-2xl">

       
        <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 mb-6">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search city..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleSearch}
            className="bg-transparent outline-none w-full placeholder-white/70"
          />
        </div>

   
        <h2 className="text-center text-lg font-semibold">
          {data?.name || location}, {country}
        </h2>


        <div className="flex justify-center my-8">
          <WeatherIcon />
        </div>


        <div className="text-center">
          <h1 className="text-7xl font-bold">
            {data?.main?.temp?.toFixed() ?? "--"}°
          </h1>
          <p className="opacity-80 mt-2">
            {weatherMain || "--"}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/20 rounded-xl p-3">
          {formatTime(sunrise)}
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            {formatTime(sunset)}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
