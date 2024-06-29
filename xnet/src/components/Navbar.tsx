import { AppBar, Toolbar, Box, Button, Typography, Avatar } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const navbarItems = [
    { text: "Home", href: "/" },
    { text: "Transactions", href: "/transactions" },
    { text: "Contacts", href: "/contacts" },
    { text: "Alerts", href: "/alerts" }
];

const Navbar = () => {
    const router = useRouter();

    return (
        <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'black' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Box sx={{ marginRight: 4, display: 'flex', alignItems: 'center' }}>
                    <Image src="/logo.png" alt="logo" width={100} height={50} />
                </Box>

                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    {navbarItems.map((item) => (
                        <Button
                            key={item.text}
                            sx={{ marginX: 2, fontWeight: router.pathname === item.href ? 'bold' : 'normal' }}
                            component={Link}
                            href={item.href}
                            underline="none"
                        >
                            {item.text}
                        </Button>
                    ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;