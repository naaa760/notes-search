"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Apply middleware to all routes
router.use((0, clerk_sdk_node_1.ClerkExpressRequireAuth)());
const getNotesHandler = async (req, res) => {
    const reqWithAuth = req;
    try {
        const notes = await prisma.note.findMany({
            where: { userId: reqWithAuth.auth.userId },
            orderBy: { updatedAt: "desc" },
        });
        res.json(notes);
    }
    catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "Failed to fetch notes" });
    }
};
router.get("/", getNotesHandler);
// Create note
const createNoteHandler = async (req, res) => {
    const reqWithAuth = req;
    try {
        const { title, content, tags, summary } = req.body;
        const note = await prisma.note.create({
            data: {
                userId: reqWithAuth.auth.userId,
                title,
                content,
                tags,
                summary,
            },
        });
        res.status(201).json(note);
    }
    catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: "Failed to create note" });
    }
};
router.post("/", createNoteHandler);
// Update note
const updateNoteHandler = async (req, res) => {
    const reqWithAuth = req;
    try {
        const { id } = req.params;
        const { title, content, tags, summary } = req.body;
        const note = await prisma.note.updateMany({
            where: {
                id,
                userId: reqWithAuth.auth.userId,
            },
            data: { title, content, tags, summary },
        });
        if (!note.count) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.json(await prisma.note.findUnique({ where: { id } }));
    }
    catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ error: "Failed to update note" });
    }
};
// Delete note
const deleteNoteHandler = async (req, res) => {
    const reqWithAuth = req;
    try {
        const { id } = req.params;
        const note = await prisma.note.deleteMany({
            where: {
                id,
                userId: reqWithAuth.auth.userId,
            },
        });
        if (!note.count) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.json({ message: "Note deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ error: "Failed to delete note" });
    }
};
// Add the summarize endpoint
const summarizeNoteHandler = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }
        // For now, return a simple summary
        const summary = `Summary of note: ${content.slice(0, 100)}...`;
        res.json({ summary });
    }
    catch (error) {
        console.error("Error summarizing note:", error);
        res.status(500).json({ error: "Failed to summarize note" });
    }
};
router.get("/", getNotesHandler);
router.post("/", createNoteHandler);
router.put("/:id", updateNoteHandler);
router.delete("/:id", deleteNoteHandler);
router.post("/summarize", summarizeNoteHandler);
exports.default = router;
