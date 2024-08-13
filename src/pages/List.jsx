import { useState, useEffect } from "react";
import axios from "axios";
import PlayerForm from "../components/PlayerForm";

function List() {
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("https://localhost:7251/api/player");
        setList(response.data);
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchPlayers();
  }, []);

  const handleDelete = async (footballPlayerId) => {
    try {
      const token = sessionStorage.getItem("authToken");

      // Check if the token is available
      if (!token) {
        console.error("No token found");
        return;
      }

      // Perform the delete request with the authorization token
      const response = await axios.delete(
        `https://localhost:7251/api/player/${footballPlayerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle the response as needed
      console.log(response.data);

      // Optionally, you might want to refresh the list or update the state
      setList((prevList) =>
        prevList.filter(
          (player) => player.footballPlayerId !== footballPlayerId
        )
      );
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };
  const handleAdd = () => {
    setEditingPlayerId(null);
    setModalOpen(true);
  };

  const handleUpdate = (footballPlayerId) => {
    setEditingPlayerId(footballPlayerId);
    setModalOpen(true);
  };
  const handleFormSubmit = () => {
    setModalOpen(false);
    // Refresh the list or perform additional actions if needed
    window.location.reload(); // Refreshing the page for simplicity, you can use state update
  };
  return (
    <div className="flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          List of Players
        </h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition-colors duration-300"
        >
          Add
        </button>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  #
                </th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  Name
                </th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  Achievements
                </th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  Birthday
                </th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  Experiences
                </th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  Nomination
                </th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  ClubName
                </th>
                <th className="py-3 px-4 border-b border-gray-700 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((player, index) => (
                <tr
                  key={player.footballPlayerId}
                  className="bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
                >
                  <td className="py-3 px-4 border-b border-gray-700">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700">
                    {player.fullName}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700">
                    {player.achievements}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700">
                    {player.birthday}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700">
                    {player.playerExperiences}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700">
                    {player.nomination}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700">
                    {player.clubName}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 flex gap-2">
                    <button
                      onClick={() => handleUpdate(player.footballPlayerId)}
                      className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition-colors duration-300"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(player.footballPlayerId)}
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PlayerForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        playerId={editingPlayerId}
        onFormSubmit={handleFormSubmit}
      />
    </div>
  );
}
export default List;
