import { useAuth } from "@clerk/nextjs";
import { Note } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

export function useApi() {
  const { getToken } = useAuth();

  const fetchWithAuth = async (
    endpoint: string,
    options: FetchOptions = {}
  ) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.error || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  };

  return {
    notes: {
      getAll: () => fetchWithAuth("/api/notes"),
      create: (note: Omit<Note, "id">) =>
        fetchWithAuth("/api/notes", {
          method: "POST",
          body: JSON.stringify(note),
        }),
      update: (id: string, note: Omit<Note, "id">) =>
        fetchWithAuth(`/api/notes/${id}`, {
          method: "PUT",
          body: JSON.stringify(note),
        }),
      delete: (id: string) =>
        fetchWithAuth(`/api/notes/${id}`, { method: "DELETE" }),
      summarize: (content: string) =>
        fetchWithAuth("/api/notes/summarize", {
          method: "POST",
          body: JSON.stringify({ content }),
        }),
    },
  };
}

export async function fetchNotes() {
  try {
    // Get the Clerk token
    const token = await fetch("/api/auth/token")
      .then((res) => res.json())
      .then((data) => data.token);

    console.log("API URL:", `${API_BASE_URL}/api/notes`); // Debug log

    const response = await fetch(`${API_BASE_URL}/api/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(
        `Error fetching notes: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function createNote(data: {
  title: string;
  content: string;
  tags: string[];
}) {
  const token = await fetch("/api/auth/token")
    .then((res) => res.json())
    .then((data) => data.token);

  const response = await fetch(`${API_BASE_URL}/api/notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error creating note: ${response.statusText}`);
  }

  return response.json();
}

export async function updateNote(
  id: string,
  data: { title: string; content: string; tags: string[] }
) {
  const token = await fetch("/api/auth/token")
    .then((res) => res.json())
    .then((data) => data.token);

  const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error updating note: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteNote(id: string) {
  const token = await fetch("/api/auth/token")
    .then((res) => res.json())
    .then((data) => data.token);

  const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error deleting note: ${response.statusText}`);
  }

  return response.json();
}
