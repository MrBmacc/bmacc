import { useState, useEffect } from "react";
import { MessageCircleQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import appInPhone from "@/assets/phone.png";

const testimonials = [
  {
    testimonial:
      "Quick and smooth. Loved the minimal clicks needed to complete a tip.",
  },
  {
    testimonial:
      "Super intuitive! Even if you're new to crypto, everything is user-friendly and straightforward.",
  },
  {
    testimonial:
      "Even if you're new to crypto, everything is user-friendly and straightforward.",
  },
];

export const SectionAbout = () => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false); // Trigger fade out

      setTimeout(() => {
        setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
        setIsVisible(true); // Trigger fade in
      }, 500); // Wait for fade out to complete
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex my-60 flex-col gap-8">
      <div className="px-4 my-36 relative overflow-hidden max-w-4xl mx-auto">
        <div
          className={`transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div key={testimonials[currentTestimonialIndex].name}>
            <p className="text-3xl italic font-bold text-blue-950 text-balance text-center">
              "{testimonials[currentTestimonialIndex].testimonial}"
            </p>
          </div>
        </div>
        <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto my-12" />
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="px-4 py-8 relative flex-1">
          <p className="text-5xl md:text-7xl font-bold text-blue-950 tracking-tighter font-brand">
            WE MAKE TIPPING EFFORTLESS
          </p>
          <p className="text-white font-bold text-2xl md:text-4xl font-brand">
            WETHER YOU'RE A CREATOR, FREELANCER OR SERVICE WORKER.
          </p>

          <p className="sm:text-xl text-gray-600 mb-8 max-w-xl my-6">
            BMACC (Buy Me a Crypto Coffee) lets anyone receive crypto tips
            through a link or QR code - no middlemen, no hassle. Built on
            blockchain for transparency, we also share 50% of platform revenue
            with token holders in USDC.
          </p>

          <p className="sm:text-xl text-gray-600 mb-8 max-w-xl my-6">
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
          className="md:w-1/2  h-auto"
        />
      </div>
    </div>
  );
};
