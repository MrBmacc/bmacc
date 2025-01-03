import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { ButtonProps } from "@/components/ui/button";

export const ButtonCopyClipboard = ({
  text,
  children,
  ...props
}: {
  text: string;
  children: React.ReactNode;
} & ButtonProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${text} copied to clipboard`,
    });
  };

  return (
    <Button onClick={() => copyToClipboard(text)} {...props} variant="ghost">
      {children}
    </Button>
  );
};
