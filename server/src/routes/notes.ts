import express, { Response, Request, RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

interface RequestWithAuth extends Request {
  auth: {
    userId: string;
  };
}

const router = express.Router();
const prisma = new PrismaClient();

// Add this middleware to log requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Apply middleware to all routes
router.use(ClerkExpressRequireAuth());

const getNotesHandler: RequestHandler = async (req: Request, res: Response) => {
  const reqWithAuth = req as RequestWithAuth;
  try {
    console.log("Auth user ID:", reqWithAuth.auth?.userId); // Debug log

    // Check if userId exists
    if (!reqWithAuth.auth?.userId) {
      return res.status(401).json({ error: "Unauthorized - No user ID found" });
    }

    const userId = reqWithAuth.auth.userId;

    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    console.log(`Found ${notes.length} notes for user ${userId}`);
    return res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({
      error: "Failed to fetch notes",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

router.get("/", getNotesHandler);

// Create note
const createNoteHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reqWithAuth = req as RequestWithAuth;
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
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
};

router.post("/", createNoteHandler);

// Update note
const updateNoteHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reqWithAuth = req as RequestWithAuth;
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
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
};

// Delete note
const deleteNoteHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reqWithAuth = req as RequestWithAuth;
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
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
};

// Add the summarize endpoint
const summarizeNoteHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    // For now, return a simple summary
    const summary = `Summary of note: ${content.slice(0, 100)}...`;
    res.json({ summary });
  } catch (error) {
    console.error("Error summarizing note:", error);
    res.status(500).json({ error: "Failed to summarize note" });
  }
};

router.post("/", createNoteHandler);
router.put("/:id", updateNoteHandler);
router.delete("/:id", deleteNoteHandler);
router.post("/summarize", summarizeNoteHandler);

export default router;
