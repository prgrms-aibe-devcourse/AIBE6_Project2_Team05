import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Portfolio {
  id: number;
  freelancerProfileId: number;
  imageUrl: string;
  description: string;
  sortOrder: number;
}

interface PortfolioTabProps {
  portfolios: Portfolio[];
  isLoggedIn: boolean;
  profileId: string;
}

export default function PortfolioTab({
  portfolios,
  isLoggedIn,
  profileId,
}: PortfolioTabProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<Portfolio | null>(null);

  if (portfolios.length === 0) {
    return (
      <div className="text-center py-16 text-[#75786c]">
        <p>등록된 포트폴리오가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.id}
            className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
            onClick={() => setSelectedImage(portfolio)}
          >
            <Image
              src={portfolio.imageUrl}
              alt={portfolio.description || "포트폴리오"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {!isLoggedIn && portfolios.length === 3 && (
        <div className="text-center py-8">
          <p className="text-sm text-[#75786c] mb-3">
            로그인하면 모든 포트폴리오를 볼 수 있어요
          </p>
          <button
            onClick={() => router.push(`/login?redirect=/profile/${profileId}`)}
            className="bg-[#4f6231] text-white px-6 py-2.5 rounded-xl text-sm hover:bg-[#677b47] transition-colors"
          >
            로그인하고 더보기
          </button>
        </div>
      )}

      {/* 이미지 확대 모달 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white text-sm hover:text-[#c5c8ba]"
            >
              닫기 ✕
            </button>
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.description || "포트폴리오"}
                fill
                className="object-contain"
              />
            </div>
            {selectedImage.description && (
              <p className="text-white text-sm text-center mt-3">
                {selectedImage.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
