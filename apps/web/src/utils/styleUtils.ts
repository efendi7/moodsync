export const getDailyCheckInStyles = (isDarkMode: boolean) => ({
  container: `${
    isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/70 border-gray-200"
  } backdrop-blur-sm rounded-2xl border p-6`,
  
  selectedMoodButton: isDarkMode 
    ? "bg-purple-500/20 scale-110" 
    : "bg-purple-100 scale-110",
  
  unselectedMoodButton: isDarkMode 
    ? "hover:bg-gray-700" 
    : "hover:bg-gray-100",
  
  moodText: isDarkMode ? "text-gray-300" : "text-gray-700",
  insightText: isDarkMode ? "text-gray-400" : "text-gray-600",
  
  iconButton: `px-4 py-3 rounded-xl border transition-colors ${
    isDarkMode
      ? "border-gray-600 hover:border-gray-400"
      : "border-gray-300 hover:border-gray-500"
  }`,
});
