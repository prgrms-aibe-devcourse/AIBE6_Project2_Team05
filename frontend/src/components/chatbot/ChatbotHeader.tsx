import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

export function ChatbotHeader({ onClose }: Props) {
  return (
    <CardHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-[#efeee7] space-y-0">
      <div className="flex items-center gap-2">
        <span className="text-lg">💍</span>
        <div>
          <p className="text-sm font-semibold text-[#1b1c18]">웨리</p>
          <p className="text-xs text-[#75786c]">
            3가지 질문으로 웨딩 견적을 알려 드려요
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="text-[#75786c] hover:text-[#1b1c18] hover:bg-[#f5f4ec] w-8 h-8"
      >
        <X className="w-4 h-4" />
      </Button>
    </CardHeader>
  );
}
