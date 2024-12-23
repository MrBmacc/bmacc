import Moralis from "moralis";
import { useState, useEffect, ReactNode, useRef } from "react";
import { LoaderIcon, SkullIcon } from "lucide-react";

export const ProviderMoralis = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const initializationAttempted = useRef(false);

  useEffect(() => {
    const initMoralis = async () => {
      if (initializationAttempted.current) return;
      initializationAttempted.current = true;

      try {
        await Moralis.start({
          apiKey: import.meta.env.VITE_MORALIS_API,
        });
      } catch (err) {
        setError(err);
        console.error("Error initializing Moralis", err);
      } finally {
        setIsLoading(false);
      }
    };

    initMoralis();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderIcon className="w-12 h-12 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
        <SkullIcon className="w-12 h-12 text-red-500" />
        <p className="text-red-500">Error initializing API</p>
      </div>
    );

  return <div>{children}</div>;
};
