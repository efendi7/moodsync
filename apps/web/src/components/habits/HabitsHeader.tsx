import { PageHeader } from "@/components/common/PageHeader";
import { ListChecks, Plus } from "lucide-react";

export const HabitsHeader = ({ isDarkMode, onCreateClick }: any) => {
  return (
    <PageHeader
      isDarkMode={isDarkMode}
      title="Habit Tracker"
      description="Bangun kebiasaan positif dan capai tujuan harianmu"
      icon={ListChecks}
      buttonText="Habit Baru"
      buttonIcon={Plus}
      onButtonClick={onCreateClick}
    />
  );
};
