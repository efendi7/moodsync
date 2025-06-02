// import React, { useEffect, useState } from 'react';
// import { getMoodEntries, createMoodEntry } from '@/lib/api';

// interface Mood {
//   mood: string;
//   date: string; // or Date, tergantung response backend
// }

// export default function MoodList() {
//   const [moods, setMoods] = useState<Mood[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     setLoading(true);
//     getMoodEntries()
//       .then(setMoods)
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, []);

//   async function addMood() {
//     setLoading(true);
//     setError(null);
//     const newMood = { mood: 'happy', date: new Date().toISOString() };
//     try {
//       await createMoodEntry(newMood);
//       const updatedMoods = await getMoodEntries();
//       setMoods(updatedMoods);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div>
//       <button onClick={addMood} disabled={loading}>
//         {loading ? "Loading..." : "Add Mood"}
//       </button>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <ul>
//         {moods.map((m, idx) => (
//           <li key={idx}>
//             {m.mood} - {new Date(m.date).toLocaleString()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
