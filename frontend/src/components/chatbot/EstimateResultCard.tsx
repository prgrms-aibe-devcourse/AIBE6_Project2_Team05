import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SERVICE_TO_CATEGORY_ID } from "@/constants/category";
import type { EstimateResult } from "@/types/chatbot";
import { useRouter } from "next/navigation";

interface Props {
  estimate: EstimateResult;
  onReset: () => void;
  showResetButton?: boolean;
}

export function EstimateResultCard({
  estimate,
  onReset,
  showResetButton = true,
}: Props) {
  const router = useRouter();

  const handleNavigate = () => {
    const serviceName = (estimate.selectedServices[0] ?? "").trim();
    const categoryId = SERVICE_TO_CATEGORY_ID[serviceName];

    const url = categoryId ? `/search?categoryId=${categoryId}` : "/search";
    router.push(url);
    router.refresh();
  };

  return (
    <div className="mx-4 my-2 p-4 border border-[#efeee7] rounded-xl bg-[#f5f4ec]">
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

      <div className="flex justify-between items-center py-2 border-t border-[#efeee7] mb-2">
        <span className="text-sm text-[#45483d]">예상 견적</span>
        <span className="text-sm font-bold text-[#4f6231]">
          {estimate.priceRange}
        </span>
      </div>

      <p className="text-xs text-[#75786c] mb-3">{estimate.summary}</p>

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