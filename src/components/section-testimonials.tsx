import { useState, useEffect } from "react";
import characterInRoom from "@/assets/bmacc-character-in-room.png";

const testimonials = [
  {
    testimonial:
      "Quick and smooth. Loved the minimal clicks needed to complete a tip.",
  },
  {
    testimonial: "Super intuitive!",
  },
  {
    testimonial:
      "Even if you're new to crypto, everything is user-friendly and straightforward.",
  },
];

export const SectionTestimonials = () => {
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
    <div className="flex md:mb-60 mb-24 flex-col md:flex-row justify-between gap-8">
      <div className="px-4 md:my-36 my-20 relative overflow-hidden max-w-4xl mx-auto min-h-36">
        <div
          className={`transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div key={testimonials[currentTestimonialIndex].testimonial}>
            <p className="text-3xl italic font-bold text-blue-950 text-balance text-center">
              "{testimonials[currentTestimonialIndex].testimonial}"
            </p>
          </div>
        </div>
      </div>

      <img
        src={characterInRoom}
        alt="Buy me a crypto coffee"
        className="md:w-1/2  h-auto"
      />
    </div>
  );
};
