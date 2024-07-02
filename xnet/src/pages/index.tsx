import { List, ListItem, ListItemText, Box, Typography, IconButton} from '@mui/material';
import data from '@/util/mock.json';
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TransactionTable from "@/components/TransactionTable";
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';


export default function Home() {
    const user = data.user;

    const getContactName = (contactId) => {
        const contact = user.contacts.find(contact => contact.id === contactId);
        return contact ? `${contact.first_name} ${contact.last_name}` : 'Unknown';
    };

    return (
        <Box sx={{
            width: "100%",
            padding: "15px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
        }}>
            <Typography variant="h4">Hello, {user.first_name} {user.last_name}</Typography>

            <Box className={"flex flex-col gap-5 h-full"}>
                <Box className={"flex gap-5 h-40"}>
                    <Box className={"w-full h-full"}>
                        <Card className={"w-full h-full"}>
                            <CardBody sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Box className={"flex w-full justify-between"}>
                                    <Typography variant="body2">Balance</Typography>
                                    <IconButton>
                                        <AccountBalanceWalletIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user.balance} {user.preferred_currency}</Typography>
                            </CardBody>
                        </Card>
                    </Box>
                    <Box className={"w-full h-full"}>
                        <Card className={"w-full h-full"}>
                            <CardBody sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Box className={"flex w-full justify-between"}>
                                    <Typography variant="body2">Total fees paid</Typography>
                                    <IconButton>
                                        <PaidIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user.fees_paid} {user.preferred_currency}</Typography>
                            </CardBody>
                        </Card>
                    </Box>
                    <Box className={"w-full h-full"}>
                        <Card className={"w-full h-full"}>
                            <CardBody sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Box className={"flex w-full justify-between"}>
                                    <Typography variant="body2">Transactions</Typography>
                                    <IconButton>
                                        <ReceiptLongIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user.transactions.length}</Typography>
                            </CardBody>
                        </Card>
                    </Box>
                </Box>
                <Box className={"h-full"}>
                    <TransactionTable user={user} />
                </Box>
            </Box>

        </Box>
    );
}