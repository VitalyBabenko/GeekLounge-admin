import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { signOut } from "next-auth/react";
import Logo from "./Logo";
import {
  CategoriesIcon,
  HomeIcon,
  LogoutIcon,
  OrdersIcon,
  ProductsIcon,
  SettingsIcon,
} from "@/assets/icons";

const Nav = ({ show }) => {
  const router = useRouter();
  const { pathname } = router;
  const inactiveLink = "flex gap-1 p-1 ";
  const activeLink = `${inactiveLink} bg-highlight bg-white text-black rounded-sm`;
  const inactiveIcon = "w-6 h-6";
  const activeIcon = inactiveIcon + " text-primary";

  async function logout() {
    await router.push("/");
    await signOut();
  }

  return (
    <aside
      className={`text-gray-500 p-4 fixed top-0 w-full bg-bgGray h-full ${
        show ? "left-0" : "-left-full"
      } md:static md:w-auto transition-all`}
    >
      <div className="mb-4 mr-2">
        <Logo />
      </div>

      <nav className="flex flex-col gap-2">
        <Link
          href={"/"}
          className={pathname === "/" ? activeLink : inactiveLink}
        >
          <HomeIcon className={pathname === "/" ? activeIcon : inactiveIcon} />
          Dashboard
        </Link>

        <Link
          href={"/products"}
          className={pathname.includes("/products") ? activeLink : inactiveLink}
        >
          <ProductsIcon
            className={
              pathname.includes("/products") ? activeIcon : inactiveIcon
            }
          />
          Products
        </Link>

        <Link
          href={"/categories"}
          className={
            pathname.includes("/categories") ? activeLink : inactiveLink
          }
        >
          <CategoriesIcon
            className={
              pathname.includes("/categories") ? activeIcon : inactiveIcon
            }
          />
          Categories
        </Link>

        <Link
          href={"/orders"}
          className={pathname.includes("/orders") ? activeLink : inactiveLink}
        >
          <OrdersIcon
            className={pathname.includes("/orders") ? activeIcon : inactiveIcon}
          />
          Orders
        </Link>
        <Link
          href={"/settings"}
          className={pathname.includes("/settings") ? activeLink : inactiveLink}
        >
          <SettingsIcon
            className={pathname.includes("/orders") ? activeIcon : inactiveIcon}
          />
          Settings
        </Link>

        <button onClick={logout} className={inactiveLink}>
          <LogoutIcon className={"w-6 h-6"} />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Nav;
