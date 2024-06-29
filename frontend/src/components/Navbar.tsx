import { Link, NavbarBrand, NavbarContent, NavbarItem, Navbar as NextNavbar } from "@nextui-org/react";
import { useRouter } from "next/router";

const NavbarItems = [{ text: "Home", href: "/" }, { text: "Transactions", href: "/transactions" }, { text: "Contacts", href: "/contacts" }, { text: "Alerts", href: "/alerts" }]

const Navbar = () => {
    const router = useRouter();

    return (
        <NextNavbar position="sticky" maxWidth="full">
            <NavbarBrand className="w-1/3">
                <p className="font-bold text-inherit">ACME</p>
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
                <div>Profile Picture</div>
            </NavbarContent>
        </NextNavbar>
    )
}
export default Navbar;