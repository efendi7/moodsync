import { PageHeader } from "@/components/common/PageHeader";
import { BookOpen, Plus } from "lucide-react";

export const JournalHeader = ({ isDarkMode, onCreateClick }: any) => {
  return (
    <PageHeader
      isDarkMode={isDarkMode}
      title="Journal Pribadi"
      description="Tulis pikiran dan perasaanmu setiap hari"
      icon={BookOpen}
      buttonText="Tulis Journal"
      buttonIcon={Plus}
      onButtonClick={onCreateClick}
    />
  );
};
