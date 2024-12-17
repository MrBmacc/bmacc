import { useCallback } from "react";
import confetti from "canvas-confetti";

// Default configuration for the confetti effect
const defaultConfig = {
  scalar: 2,
  spread: 180,
  particleCount: 30,
  origin: { y: -0.1 },
  startVelocity: -35,
};

// Create emoji shapes with different scalars
const createMoneyShapes = (scalar = 2) => ({
  flyingMoney: confetti.shapeFromText({ text: "💸", scalar }),
  coin: confetti.shapeFromText({ text: "🪙", scalar }),
  dollar: confetti.shapeFromText({ text: "💵", scalar }),
  moneyFace: confetti.shapeFromText({ text: "🤑", scalar }),
});

type Emoji = "flyingMoney" | "coin" | "dollar" | "moneyFace";

type ConfettiOptions = {
  emoji?: Emoji;
  flat?: boolean;
  scalar?: number;
  interval?: number;
  iterations?: number;
  particleCount?: number;
};

export const useConfetti = () => {
  const fireConfetti = useCallback((options: ConfettiOptions) => {
    const { emoji = "flyingMoney", scalar = 2, ...customConfig } = options;

    const shapes = createMoneyShapes(scalar);

    const config = {
      ...defaultConfig,
      ...customConfig,
      shapes: [shapes[emoji]],
      scalar,
    };

    return confetti(config);
  }, []);

  const fireMoneyShower = useCallback(
    (options: ConfettiOptions) => {
      const { interval = 100, iterations = 3, ...customConfig } = options;

      const shoot = () => {
        // Main emoji burst
        fireConfetti({
          particleCount: 30,
          ...customConfig,
        });

        // Flat particles for visual interest
        fireConfetti({
          particleCount: 5,
          flat: true,
          ...customConfig,
        });

        // Smaller circles mixed in
        confetti({
          ...defaultConfig,
          particleCount: 15,
          scalar: customConfig.scalar ? customConfig.scalar / 2 : 1,
          shapes: ["circle"],
        });
      };

      // Create sequential bursts
      for (let i = 0; i < iterations; i++) {
        setTimeout(shoot, interval * i);
      }
    },
    [fireConfetti]
  );

  const fireAllMoney = useCallback(
    (options: ConfettiOptions) => {
      const emojis: Emoji[] = ["flyingMoney", "coin", "dollar", "moneyFace"];
      emojis.forEach((emoji, index) => {
        setTimeout(() => {
          fireConfetti({
            emoji,
            particleCount: 20,
            ...options,
          });
        }, index * 100);
      });
    },
    [fireConfetti]
  );

  return {
    fireConfetti,
    fireMoneyShower,
    fireAllMoney,
  };
};
