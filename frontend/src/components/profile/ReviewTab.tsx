import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Review {
  id: number;
  memberId: number;
  memberName: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface ReviewTabProps {
  reviews: Review[];
}

export default function ReviewTab({ reviews }: ReviewTabProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 text-[#75786c]">
        <p>아직 리뷰가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-2xl p-6 border border-[#efeee7]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarFallback className="bg-[#d3ebac] text-[#4f6231] font-semibold text-sm">
                {review.memberName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-[#1b1c18] text-sm">
                {review.memberName}
              </p>
              <p className="text-xs text-[#75786c]">
                {review.createdAt.slice(0, 10)}
              </p>
            </div>
            <div className="flex items-center gap-0.5 ml-auto">
              {[...Array(review.rating)].map((_, j) => (
                <svg
                  key={j}
                  className="w-3.5 h-3.5 text-[#f59e0b] fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-sm text-[#45483d] leading-relaxed">
            {review.content}
          </p>
        </div>
      ))}
    </div>
  );
}
