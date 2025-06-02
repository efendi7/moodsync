const API_BASE_URL = "http://localhost:5000/api";

export async function getMoodEntries() {
  const res = await fetch(`${API_BASE_URL}/moods`);
  if (!res.ok) throw new Error("Failed to fetch moods");
  return res.json();
}

export async function createMoodEntry(data: any) {
  const res = await fetch(`${API_BASE_URL}/moods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create mood entry");
  return res.json();
}
