export const getThemeClasses = (isDarkMode: boolean): string => {
  return isDarkMode
    ? 'min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white'
    : 'min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900';
};

export const getMainContentMargin = (isOpen: boolean, isCollapsed: boolean): string => {
  if (isOpen) return 'lg:ml-64';
  return isCollapsed ? 'lg:ml-20' : 'lg:ml-64';
};