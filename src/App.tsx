import { useEffect } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/router";
import { sdk } from "@farcaster/miniapp-sdk";

function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const isInMiniApp = await sdk.isInMiniApp();
        console.log("Is in Farcaster Mini App:", isInMiniApp);
        
        if (isInMiniApp) {
            try {
              await sdk.actions.ready();
              console.log("Farcaster SDK ready called successfully");
            } catch (readyError) {
              console.error("Failed to call ready:", readyError);
            }
        } else {
          console.log("Not in Farcaster Mini App context, skipping ready call");
        }
      } catch (error) {
        console.error("Failed to initialize Farcaster SDK:", error);
      }
    };

    initializeApp();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
