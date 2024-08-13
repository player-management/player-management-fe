import { useState, useEffect } from "react";
import axios from "axios";

function PlayerForm({ isOpen, onClose, playerId, onFormSubmit }) {
  const [fullName, setFullName] = useState("");
  const [footballPlayerId, setFootballPlayerId] = useState("");
  const [achievements, setAchievements] = useState("");
  const [birthday, setBirthday] = useState(""); // yyyy-MM-dd format
  const [playerExperiences, setPlayerExperiences] = useState("");
  const [nomination, setNomination] = useState("");
  const [footballClubId, setFootballClubId] = useState("");
  const [clubs, setClubs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch categories (clubs) from API endpoint
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7251/api/player/categories"
        );
        setClubs(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorMessage("Error fetching categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch player data if editing
  useEffect(() => {
    const fetchPlayer = async () => {
      const token = sessionStorage.getItem("authToken");
      if (playerId) {
        try {
          const response = await axios.get(
            `https://localhost:7251/api/player/${playerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const player = response.data;
          console.log("Fetched player:", player); // Add this line
          setFullName(player.fullName);
          setAchievements(player.achievements);
          setBirthday(player.birthday.split("T")[0]); // Convert to yyyy-MM-dd format
          setPlayerExperiences(player.playerExperiences);
          setNomination(player.nomination);
          setFootballClubId(player.footballClubId);
          setFootballPlayerId(player.footballPlayerId); // Add this line
        } catch (error) {
          console.error("Error fetching player data:", error);
          setErrorMessage("Error fetching player data");
        }
      }
    };

    fetchPlayer();
  }, [playerId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      // Convert birthday to ISO format for the backend
      const formattedBirthday = new Date(birthday).toISOString();

      const playerData = {
        footballPlayerId,
        fullName,
        achievements,
        birthday: formattedBirthday, // Use ISO format
        playerExperiences,
        nomination,
        footballClubId,
      };

      if (playerId) {
        // Update existing player
        await axios.put(`https://localhost:7251/api/player`, playerData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        // Add new player
        await axios.post(`https://localhost:7251/api/player`, playerData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      onFormSubmit(); // Notify parent component to refresh or close modal
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Error submitting form");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            {playerId ? "Update Player" : "Add Player"}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="footballPlayerId"
                className="block text-white mb-2"
              >
                Player ID
              </label>
              <input
                type="text"
                id="footballPlayerId"
                value={footballPlayerId}
                onChange={(e) => setFootballPlayerId(e.target.value)}
                readOnly
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="achievements" className="block text-white mb-2">
                  Achievements
                </label>
                <input
                  type="text"
                  id="achievements"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="mb-4">
                <label htmlFor="birthday" className="block text-white mb-2">
                  Birthday
                </label>
                <input
                  type="date"
                  id="birthday"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="playerExperiences"
                  className="block text-white mb-2"
                >
                  Experiences
                </label>
                <input
                  type="text"
                  id="playerExperiences"
                  value={playerExperiences}
                  onChange={(e) => setPlayerExperiences(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="mb-4">
                <label htmlFor="nomination" className="block text-white mb-2">
                  Nomination
                </label>
                <input
                  type="text"
                  id="nomination"
                  value={nomination}
                  onChange={(e) => setNomination(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="footballClubId"
                  className="block text-white mb-2"
                >
                  Club
                </label>
                <select
                  id="footballClubId"
                  value={footballClubId}
                  onChange={(e) => setFootballClubId(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="" disabled>
                    Select a club
                  </option>
                  {clubs.map((club) => (
                    <option
                      key={club.footballClubId}
                      value={club.footballClubId}
                    >
                      {club.clubName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
            >
              {playerId ? "Update Player" : "Add Player"}
            </button>
            {errorMessage && (
              <p className="text-red-500 text-center mt-4">{errorMessage}</p>
            )}
          </form>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            X
          </button>
        </div>
      </div>
    )
  );
}

export default PlayerForm;
