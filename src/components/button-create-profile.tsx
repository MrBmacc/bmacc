import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

import X from "@/components/icons/x";
import Google from "@/components/icons/google";
import GitHub from "@/components/icons/github";
import { ButtonModal } from "@/components/button-modal";

export const ButtonCreateProfile = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const iconVariants = {
    animate: {
      y: [45, 51, 17, 17, -17, -17, -51, -51, -17, -17, 17, 17, 50],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 16,
          times: [
            0, 0.0833, 0.1666, 0.25, 0.3333, 0.4166, 0.5, 0.5833, 0.6666, 0.75,
            0.8333, 0.9166, 1,
          ],
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <ButtonModal
      screen="Connect"
      className="relative overflow-hidden flex items-center gap-3"
    >
      <motion.div
        animate="animate"
        variants={iconVariants}
        className="flex flex-col justify-start gap-4"
      >
        <UserPlus size={22} />
        <Google width={22} height={22} />
        <X width={22} height={22} />
        <GitHub width={22} height={22} />
      </motion.div>
      {children || <span>Create Profile</span>}
    </ButtonModal>
  );
};
