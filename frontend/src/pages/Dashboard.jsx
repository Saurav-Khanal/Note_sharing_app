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
      setRoomName("");
      setShowCreate(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return;
    try {
      const res = await api.post("/rooms/join", {code:joinCode });
      setRooms([...rooms, res.data.room]);
      setJoinCode("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
            <button className="create-room" onClick={()=>setShowCreate(!showCreate)}>+ Create Room</button>
          ) : (
            <button className="create-room" onClick={()=> setShowJoin(!showJoin)} >+ Join Room</button>
          )}
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
          <div className="input-box">
            <input
              placeholder="Enter room code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <button onClick={handleJoinRoom}>Join</button>
          </div>
        )}

        {rooms.map((room) => (
          <div className="Rooms" key={room._id}>
            <div className="Room-name">
              <div className="room-info">
                <h2>{room.name}</h2>
                <p>code:{room.code}</p>
              </div>
              <button className="open">open</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
