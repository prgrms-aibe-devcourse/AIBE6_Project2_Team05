import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ProfileLoadingState() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fbf9f2]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#4f6231] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#75786c]">
            프로필을 불러오는 중입니다...
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
