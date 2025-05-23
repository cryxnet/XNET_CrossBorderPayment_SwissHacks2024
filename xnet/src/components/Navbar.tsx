import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Avatar,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const navbarItems = [
  { text: "Home", href: "/" },
  { text: "Transactions", href: "/transactions" },
  { text: "Contacts", href: "/contacts" },
  { text: "Alerts", href: "/alerts" },
];

const Navbar = () => {
  const router = useRouter();

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#0d1117",
        color: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 2rem",
        }}
      >
        <div className="flex items-center">
          <Image src="/white_logo.png" alt="logo" width={100} height={50} />
        </div>

        <div className="flex flex-1 justify-center gap-3">
          {navbarItems.map((item) => (
            <Button
              key={item.text}
              sx={{
                marginX: 2,
                fontWeight: router.pathname === item.href ? "bold" : "normal",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,1)",
                  color: "white",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  transform: "scale(1.05)",
                },
                transition: "transform 0.3s ease-in-out",
              }}
              component={Link}
              href={item.href}
            >
              {item.text}
            </Button>
          ))}
        </div>

        <div className="flex justify-end items-center gap-2">
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            John Doe
          </Typography>
          <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
