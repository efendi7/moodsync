import { PageHeader } from "@/components/common/PageHeader";
import { Smile } from "lucide-react";

export const MoodTrackerHeader = ({ isDarkMode }: any) => {
  return (
    <PageHeader
      isDarkMode={isDarkMode}
      title="Mood Tracker"
      description="Catat suasana hati kamu dan temukan pola kesejahteraanmu"
      icon={Smile}
    />
  );
};
