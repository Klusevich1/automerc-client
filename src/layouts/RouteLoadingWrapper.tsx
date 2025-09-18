import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { stopLoading } from "@/redux/loadingSlice";

const RouteLoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleComplete = (_url: string, info?: { shallow?: boolean }) => {
      dispatch(stopLoading());
      if (!info?.shallow) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const handleError = (_err: unknown, _url: string, info?: { shallow?: boolean }) => {
      dispatch(stopLoading());
      if (!info?.shallow) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    router.events.on("routeChangeComplete", handleComplete as any);
    router.events.on("routeChangeError", handleError as any);

    return () => {
      router.events.off("routeChangeComplete", handleComplete as any);
      router.events.off("routeChangeError", handleError as any);
    };
  }, [router.events, dispatch]);

  return <>{children}</>;
};

export default RouteLoadingWrapper;
