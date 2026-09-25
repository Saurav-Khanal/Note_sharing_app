const Note = require("../models/Note");
const Room = require("../models/Room");

const uploadNote = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { title, subject } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "file is required" });
    }
    if (!title || !subject) {
      return res.status(400).json({ message: "Title and subject required" });
    }
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (room.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "only the room teacher can upload",
      });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    const note = await Note.create({
      title,
      subject,
      fileUrl,
      room: roomId,
      uploadedBy: req.user._id,
    });
    res.status(201).json({ note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRoomNotes = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room){
    return res.status(404).json({ message: "Room not found" });
    }
    const isTeacher = room.teacher.toString() === req.user._id.toString();
    const isMember = room.members.some(
      (m) => m.toString() === req.user._id.toString(),
    );
    if (!isTeacher && !isMember) {
      return res.status(403).json({ message: "No access to this room" });
    }
    const notes = await Note.find({ room: roomId }).populate(
      "uploadedBy",
      "name email",
    );
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchNotes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "search query required" });
    }
    const rooms = await Room.find({
      $or: [{ teacher: req.user._id }, { members: req.user._id }],
    });
    const roomIds = rooms.map((r) => r._id);
    const notes = await Note.find({
      room: { $in: roomIds },
      $or: [
        { title: { $regex: q, $options: "i" } },
        { subject: { $regex: q, $options: "i" } },
      ]
    }).populate("uploadedBy","name email");
    res.json({notes});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={uploadNote,getRoomNotes,searchNotes};