import { useState, useEffect, startTransition } from "react";

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    startTransition(() => {
      setHasMounted(true);
    });
  }, []);
  return hasMounted;
}
