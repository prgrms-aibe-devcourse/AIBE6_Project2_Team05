import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FreelancerReviewHistory } from "@/components/review/FreelancerReviewHistory";

export default function MyReviewsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f2]">
      <Navbar />
      <FreelancerReviewHistory />
      <Footer />
    </div>
  );
}
