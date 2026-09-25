import React, { useEffect, useState } from "react";
import api from "../api/api";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

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
            <button className="create-room">+ Create Room</button>
          ) : (
            <button className="create-room">+ Join Room</button>
          )}
        </div>
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
