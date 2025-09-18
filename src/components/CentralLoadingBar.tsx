// components/CenterLoadingBar.tsx
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function CenterLoadingBar() {
  const isLoading = useSelector((s: RootState) => s.loading.isLoading);
  if (!isLoading) return null;

  return (
    <>
      <div className="fixed inset-0 bg-white bg-opacity-40 z-[9999] pointer-events-none flex items-center justify-center">
        <div
          className="relative h-[3px] rounded-full"
          style={{ width: "clamp(240px, 40vw, 520px)" }}
        >
          {/* трек */}
          <div className="absolute inset-0 bg-gray-200/80 rounded-full" />
          {/* бегущая часть */}
          <div
            className="absolute inset-y-0 left-0 rounded-full animate-loadingbar"
            style={{
              width: "28%",
              background:
                "linear-gradient(90deg, #111827 0%, #111827 70%, rgba(17,24,39,0) 100%)",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes loadingbar {
          0%   { transform: translateX(-30%); }
          45%  { transform: translateX(35%); }
          100% { transform: translateX(110%); }
        }
        .animate-loadingbar {
          animation: loadingbar 1.2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
