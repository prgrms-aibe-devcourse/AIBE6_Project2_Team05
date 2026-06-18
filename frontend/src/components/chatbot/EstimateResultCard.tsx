import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EstimateResult } from "@/types/chatbot";
import { useRouter } from "next/navigation";

interface Props {
  estimate: EstimateResult;
  onReset: () => void;
  showResetButton?: boolean;
}

function parsePriceRange(priceRange: string): { min: number; max: number } {
  const numbers = priceRange.match(/\d+/g);
  if (!numbers || numbers.length < 2) return { min: 0, max: 0 };
  return {
    min: parseInt(numbers[0]) * 10000,
    max: parseInt(numbers[1]) * 10000,
  };
}

export function EstimateResultCard({
  estimate,
  onReset,
  showResetButton = true,
}: Props) {
  const router = useRouter();

  const handleNavigate = () => {
    const { min, max } = parsePriceRange(estimate.priceRange);
    router.push(`/freelancers?minPrice=${min}&maxPrice=${max}`);
  };

  return (
    <div className="mx-4 my-2 p-4 border border-[#efeee7] rounded-xl bg-[#f5f4ec]">
      {/* 선택 서비스 목록 */}
      <p className="text-xs text-[#75786c] mb-2">선택하신 서비스</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {estimate.selectedServices.map((service) => (
          <Badge
            key={service}
            variant="outline"
            className="bg-white text-[#4f6231] border-[#efeee7] rounded-full"
          >
            {service}
          </Badge>
        ))}
      </div>

      {/* 가격 범위 */}
      <div className="flex justify-between items-center py-2 border-t border-[#efeee7] mb-2">
        <span className="text-sm text-[#45483d]">예상 견적</span>
        <span className="text-sm font-bold text-[#4f6231]">
          {estimate.priceRange}
        </span>
      </div>

      {/* 요약 멘트 */}
      <p className="text-xs text-[#75786c] mb-3">{estimate.summary}</p>

      {/* CTA 버튼 */}
      <Button
        onClick={handleNavigate}
        className="w-full bg-[#4f6231] hover:bg-[#677b47] text-white rounded-xl mb-2"
      >
        프리랜서 탐색하기 →
      </Button>

      {showResetButton && (
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full border-[#4f6231] text-[#4f6231] hover:bg-[#f5f4ec] rounded-xl"
        >
          다른 서비스 견적도 보기
        </Button>
      )}
    </div>
  );
}
