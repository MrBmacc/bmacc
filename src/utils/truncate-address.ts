export const truncateAddress = (address: string | null | undefined): string => {
  if (!address) return "Invalid Address";
  if (address.startsWith("0x")) {
    return `${address.substring(0, 12)}...${address.substring(
      address.length - 4
    )}`;
  }
  // Handle Tron addresses or other formats
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};
