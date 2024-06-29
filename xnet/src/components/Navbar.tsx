import {Link, NavbarBrand, NavbarContent, NavbarItem, Navbar as NextNavbar, Avatar} from "@nextui-org/react";
import { useRouter } from "next/router";
import {Image} from "@nextui-org/image";

const NavbarItems = [{ text: "Home", href: "/" }, { text: "Transactions", href: "/transactions" }, { text: "Contacts", href: "/contacts" }, { text: "Alerts", href: "/alerts" }]

const Navbar = () => {
    const router = useRouter();

    return (
        <NextNavbar position="sticky" maxWidth="full">
            <NavbarBrand className="w-1/3">
                <Image width={100} src={"/logo.png"} className="font-bold text-inherit"></Image>
            </NavbarBrand>

            <NavbarContent justify="center">
                {NavbarItems.map((item) => {
                    return (
                        <NavbarItem className="[&:not(:last-child)]:mr-8" isActive={router.pathname === item.href} key={item.text}>
                            <Link href={item.href}>
                                {item.text}
                            </Link>
                        </NavbarItem>
                    )
                })}
            </NavbarContent>

            <NavbarContent justify="end" className="w-1/3">
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
            </NavbarContent>
        </NextNavbar>
    )
}
export default Navbar;