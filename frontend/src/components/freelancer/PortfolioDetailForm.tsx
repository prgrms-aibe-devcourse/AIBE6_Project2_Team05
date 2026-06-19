import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INDUSTRIES } from "./FreelancerProfileForm";

const CalendarIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-[#75786c] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

interface PortfolioDetailFormProps {
  startDate: string;
  endDate: string;
  client: string;
  industry: string;
  purpose: string;
  bgColor?: string;
  onChange: (key: string, value: string) => void;
}

export default function PortfolioDetailForm({
  startDate,
  endDate,
  client,
  industry,
  purpose,
  bgColor = "bg-[#f5f4ec]",
  onChange,
}: PortfolioDetailFormProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label className="text-xs text-[#75786c]">시작일</Label>
        <div className="relative">
          <input
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => onChange("startDate", e.target.value)}
            className={`w-full h-9 px-3 pl-8 rounded-xl ${bgColor} border border-[#efeee7] text-xs text-[#1b1c18] focus:outline-none focus:ring-2 focus:ring-[#6C814C]`}
          />
          <CalendarIcon />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[#75786c]">종료일</Label>
        <div className="relative">
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => onChange("endDate", e.target.value)}
            className={`w-full h-9 px-3 pl-8 rounded-xl ${bgColor} border border-[#efeee7] text-xs text-[#1b1c18] focus:outline-none focus:ring-2 focus:ring-[#6C814C]`}
          />
          <CalendarIcon />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[#75786c]">클라이언트</Label>
        <Input
          value={client}
          onChange={(e) => onChange("client", e.target.value)}
          placeholder="예: 신랑신부님"
          className={`h-9 text-xs ${bgColor} border-[#efeee7] focus-visible:ring-[#6C814C]`}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-[#75786c]">업종</Label>
        <select
          value={industry}
          onChange={(e) => onChange("industry", e.target.value)}
          className={`w-full h-9 px-3 rounded-xl ${bgColor} border border-[#efeee7] text-xs text-[#1b1c18] focus:outline-none focus:ring-2 focus:ring-[#6C814C]`}
        >
          <option value="">선택</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1 col-span-2">
        <Label className="text-xs text-[#75786c]">목적별</Label>
        <Input
          value={purpose}
          onChange={(e) => onChange("purpose", e.target.value)}
          placeholder="예: 웨딩"
          className={`h-9 text-xs ${bgColor} border-[#efeee7] focus-visible:ring-[#6C814C]`}
        />
      </div>
    </div>
  );
}
