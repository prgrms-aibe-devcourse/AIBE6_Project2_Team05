import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProfileErrorStateProps {
  error: string | null;
}

export default function ProfileErrorState({ error }: ProfileErrorStateProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-[#1b1c18] mb-2">
            프로필을 찾을 수 없습니다
          </p>
          <p className="text-sm text-[#75786c] mb-6">{error}</p>
          <Link
            href="/search"
            className={cn(
              buttonVariants(),
              "bg-[#4f6231] text-white hover:bg-[#677b47] rounded-xl",
            )}
          >
            프리랜서 탐색하기
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
