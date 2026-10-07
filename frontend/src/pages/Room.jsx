import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Room.css";

const Room = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [showUpload,setShowUpload]=useState(false);
  const[title,setTitle]=useState("");
  const[subject,setSubject]=useState("");
  const[file,setFile]=useState(null);

  const Uploadhandle=async ()=>{
    if(!title || !subject || !file) return;
    const formData=new FormData();
    formData.append("title",title);
    formData.append("subject",subject);
    formData.append("file",file);
    try{
      await api.post(`/notes/${id}`,formData,{
        headers:{"Content-Type":"multipart/form-data"}
      })
      //reset form
      setTitle("");
      setSubject("");
      setFile(null);
      setShowUpload(false);
      //re fetch note
      const res=await api.get(`/notes/${id}`);
      setNotes(res.data.notes);
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNotes(res.data.notes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotes();
  }, [id]);

  const handleDeleteNote=async(noteId)=>{
    if(!window.confirm("Delete this note?")) return;
    try{
      await api.delete(`/notes/${noteId}`);
      setNotes(notes.filter((n)=>n._id!==noteId));
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="room-container">
      <div className="room-nav">
        <h1>Room Notes</h1>
        <button onClick={() => navigate("/dashboard")}>Back</button>
      </div>
      {user.role === "teacher" && (
        <button className="upload-btn" onClick={()=> setShowUpload(!showUpload)} >+ Upload Note</button>
      )}

      {showUpload&&(
        <div className="upload-form">
          <input
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          />
          <input
          placeholder="Subject"
          value={subject}
          onChange={(e)=>setSubject(e.target.value)}
          />
          <input
          type="file"
          onChange={(e)=>setFile(e.target.files[0])}
          />
          <button onClick={Uploadhandle}>Upload</button>
          </div>
      )}

      <div className="notes-list">
        {notes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div className="note-card" key={note._id}>
              <div>
                <h3>{note.title}</h3>
                <p>{note.subject}</p>
              </div>
              <a
              href={`${import.meta.env.VITE_API_URL.replace("/api", "")}${note.fileUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                view
              </a>
              {user.role==="teacher"&&(
                <button
                className="delete-note-btn"
                onClick={()=> handleDeleteNote(note._id)}
                >Delete</button>

              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Room;