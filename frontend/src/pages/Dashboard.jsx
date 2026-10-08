import React, { useEffect, useState } from "react";
import api from "../api/api";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [showCreate, setShowCreate] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [showJoin, setShowJoin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error,setError]=useState("");
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms/my");
        setRooms(res.data.rooms);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    try {
      const res = await api.post("/rooms", { name: roomName });
      setRooms([...rooms,res.data.room]);
      setRoomName("");
      setShowCreate(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return;
    setError()
    try {
      const res = await api.post("/rooms/join", { code: joinCode });
      setRooms([...rooms, res.data.room]);
      setJoinCode(false);
    } catch (err) {
      setError(err.response?.data?.message||"failed to join room");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = async () => {
     console.log("Search clicked:", searchQuery);   // ← add this
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/notes/search?q=${searchQuery}`);
      setSearchResults(res.data.notes);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteRoom=async(roomId)=>{
    if(!window.confirm("Delete this room?")) return;
    try{
      await api.delete(`/rooms/${roomId}`);
      setRooms(rooms.filter((r)=>r._id!==roomId));
    }catch(err){
      console.log(err);
    }
  }

  if (!user) return null;
  return (
    <div className="dash-container">
      <div className="dash-nav">
        <h1>NotesApp</h1>
        <div className="side-area">
          <span>Hi,{user?.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      <div className="Room-section">
        <div className="room-space">
          <h1>My Rooms</h1>
          {user.role === "teacher" ? (
            <button
              className="create-room"
              onClick={() => setShowCreate(!showCreate)}
            >
              + Create Room
            </button>
          ) : (
            <button
              className="create-room"
              onClick={() => setShowJoin(!showJoin)}
            >
              + Join Room
            </button>
          )}
        </div>

        <div className="search-bar">
          <input
            className="search-input"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {showCreate && user.role === "teacher" && (
          <div className="input-box">
            <input
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <button onClick={handleCreateRoom}>Create</button>
          </div>
        )}

        {showJoin && user.role === "student" && (
          <>
          <div className="input-box">
            <input
              placeholder="Enter room code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <button onClick={handleJoinRoom}>Join</button>
          </div>
          {error && <p className="dash-error">{error}</p>}
          </>
        )}

        {rooms.map((room) => (
          <div className="Rooms" key={room._id}>
            <div className="Room-name">
              <div className="room-info">
                <h2>{room.name}</h2>
                <p>code:{room.code}</p>
              </div>
              <div className="room-buttons">
                <button className="open" onClick={()=>navigate(`/room/${room._id}`)}>
                open
                </button>
              {user.role==="teacher"&&(
                <button className="delete-btn" onClick={()=>handleDeleteRoom(room._id)}>
                  Delete
                </button>
              )}
              </div>
            </div>
          </div>
        ))}
        {
          searchResults.length>0&&(
            <div className="search-results">
              <h3>Search Results</h3>
              {searchResults.map((note)=>(
                <div className="note-card" key={note._id}>
                  <div>
                    <h3>{note.title}</h3>
                    <p>{note.subject}</p>
                    </div>
                    <a
                    href={`${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "")}${note.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    >
                    View
                    </a>
                    </div>
              ))}
              </div>
          )
        }
      </div>
    </div>
  );
};

export default Dashboard;
