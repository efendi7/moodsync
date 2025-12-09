import React from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  isDarkMode: boolean;
  title: string;
  description: string;
  icon?: LucideIcon;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonIcon?: LucideIcon;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  isDarkMode,
  title,
  description,
  icon: Icon,
  buttonText,
  onButtonClick,
  buttonIcon: ButtonIcon,
}) => {
  return (
    <div className="mb-10 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3 mb-3">
          {Icon && <Icon className="w-10 h-10 text-purple-500" />}
          <h1 className="text-4xl font-bold">{title}</h1>
        </div>

        <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
          {description}
        </p>
      </div>

      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r 
            from-purple-600 to-pink-600 text-white rounded-xl font-semibold 
            hover:shadow-lg transform hover:scale-105 transition-all"
        >
          {ButtonIcon && <ButtonIcon className="w-5 h-5" />}
          {buttonText}
        </button>
      )}
    </div>
  );
};
