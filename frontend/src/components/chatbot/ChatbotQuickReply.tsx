import { Badge } from "@/components/ui/badge";
import type { QuickReply } from "@/types/chatbot";

interface Props {
  quickReplies: QuickReply[];
  onSelect: (value: string) => void;
  disabled: boolean;
}

export function ChatbotQuickReply({ quickReplies, onSelect, disabled }: Props) {
  if (quickReplies.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-end gap-2 px-4 pt-2 pb-6">
      {quickReplies.map((reply) => (
        <Badge
          key={reply.value}
          onClick={() => !disabled && onSelect(reply.value)}
          variant="outline"
          className={`cursor-pointer border-[#4f6231] text-[#4f6231] rounded-full px-3 py-4 text-sm font-normal
    hover:bg-[#4f6231] hover:text-white transition-colors
    ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
        >
          {reply.label}
        </Badge>
      ))}
    </div>
  );
}
