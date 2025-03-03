import { MessageCircleQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import appInPhone from "@/assets/phone.png";

export const SectionAbout = () => {
  return (
    <div className="flex md:my-60 my-8 flex-col md:flex-row justify-between gap-8">
      <div className="px-4 py-8 relative flex-1">
        <p className="text-5xl md:text-7xl font-bold text-blue-950 tracking-tighter font-brand">
          WE MAKE TIPPING EFFORTLESS
        </p>
        <p className="text-white font-bold text-2xl md:text-4xl font-brand">
          WHETHER YOU'RE A CREATOR, FREELANCER OR SERVICE WORKER.
        </p>

        <p className="sm:text-lg text-gray-600 mb-8 max-w-xl my-6">
          BMACC (Buy Me a Crypto Coffee) lets anyone receive crypto tips through
          a link or QR code - no middlemen, no hassle. Built on blockchain for
          transparency, we also share 50% of platform revenue with token holders
          in USDC.
        </p>

        <p className="sm:text-lg text-gray-600 mb-8 max-w-xl my-6">
          Effortless tipping. Real rewards. Crypto tipping made simple.
        </p>

        <div className="flex flex-row flex-wrap gap-4">
          <Button asChild className="w-full md:w-auto">
            <a href="https://bmacc.io/faq" target="_blank">
              <MessageCircleQuestion size={20} />
              FAQ
            </a>
          </Button>
          <Button asChild className="w-full md:w-auto">
            <a href="https://bmacc.io" target="_blank">
              Learn more
            </a>
          </Button>
        </div>
      </div>

      <img
        src={appInPhone}
        alt="Buy me a crypto coffee"
        className="w-full md:w-1/2 max-w-[500px] object-contain h-auto"
      />
    </div>
  );
};
