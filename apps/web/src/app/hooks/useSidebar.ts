import { useState, useCallback } from 'react';

export const useSidebar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const collapseSidebar = useCallback(() => {
    setIsSidebarCollapsed(true);
  }, []);

  const expandSidebar = useCallback(() => {
    setIsSidebarCollapsed(false);
  }, []);

  return {
    isSidebarCollapsed,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
  };
};