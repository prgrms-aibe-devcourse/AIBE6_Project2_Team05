import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/auth";
import type { EstimateResult } from "@/types/chatbot";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

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
  const categoriesRef = useRef<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const prefetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        categoriesRef.current = await res.json();
      } catch {}
    };
    prefetchCategories();
  }, []);

  const handleNavigate = () => {
    const serviceName = estimate.selectedServices[0] ?? "";

    const matched = categoriesRef.current.find((cat) => {
      const serviceFirst = serviceName.split(/[\s·]/)[0];
      const catFirst = cat.name.split(/[\s·]/)[0];

      return (
        serviceName.includes(cat.name) || // 완전 포함
        cat.name.includes(serviceName) || // 역방향 포함
        (serviceFirst.length >= 2 && serviceFirst === catFirst)
      );
    });

    if (matched) {
      router.push(`/search?categoryId=${matched.id}`);
    } else {
      router.push("/search");
    }
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
