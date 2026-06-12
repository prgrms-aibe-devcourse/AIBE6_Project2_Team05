import Image from "next/image";

interface Portfolio {
  id: number;
  freelancerProfileId: number;
  imageUrl: string;
  description: string;
  sortOrder: number;
}

interface PortfolioTabProps {
  portfolios: Portfolio[];
}

export default function PortfolioTab({ portfolios }: PortfolioTabProps) {
  if (portfolios.length === 0) {
    return (
      <div className="text-center py-16 text-[#75786c]">
        <p>등록된 포트폴리오가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      {portfolios.map((portfolio) => (
        <div
          key={portfolio.id}
          className="relative aspect-[4/3] rounded-xl overflow-hidden group"
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
  );
}
