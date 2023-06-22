import Link from "next/link";
import { LogoIcon } from "@/assets/icons";

const Logo = () => {
  return (
    <Link href={"/"} className="flex gap-1">
      <LogoIcon />
      <span>GeekLounge admin</span>
    </Link>
  );
};

export default Logo;
