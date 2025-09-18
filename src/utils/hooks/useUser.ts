import { useEffect, useState, useCallback } from "react";
import { defaultFetch } from "@/utils/fetch's/defaultFetch";
import { UserData } from "@/Types/UserData";

export function useUser() {
  const [user, setUser] = useState<null | UserData>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await defaultFetch("/auth/user", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      const userData = await res.json();
      console.log(userData)
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, refetch: fetchUser };
}
