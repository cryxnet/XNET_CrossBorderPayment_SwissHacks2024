import {
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import data from "@/util/mock.json";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TransactionTable from "@/components/TransactionTable";
import PaidIcon from "@mui/icons-material/Paid";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export default function Home() {
  const user = data.user;

  const getContactName = (contactId) => {
    const contact = user.contacts.find((contact) => contact.id === contactId);
    return contact ? `${contact.first_name} ${contact.last_name}` : "Unknown";
  };

  return (
    <div className="h-[calc(100%-2rem)] w-[calc(100%-2rem)] m-4">
      <div className="h-11 mb-4 w-[calc(80%-2rem)]">
        <Typography variant="h4">
          Hello, {user.first_name} {user.last_name}
        </Typography>
      </div>
      <div className="w-full h-[calc(100%-64px)]">
        <div className="w-full flex h-1/4 mb-2">
          <Card className="w-1/3 h-[calc(100%-0.5rem)]">
            <CardBody className="flex w-full justify-between">
              <div className="flex w-full justify-between">
                <Typography variant="body2">Balance</Typography>
                <IconButton>
                  <AccountBalanceWalletIcon />
                </IconButton>
              </div>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {user.balance} {user.preferred_currency}
              </Typography>
            </CardBody>
          </Card>
          <Card className="mr-4 ml-4 w-1/3 h-[calc(100%-0.5rem)]">
            <CardBody className="flex flex-col justify-between">
              <div className="flex w-full justify-between">
                <Typography variant="body2">Total fees paid</Typography>
                <IconButton>
                  <PaidIcon />
                </IconButton>
              </div>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {user.fees_paid} {user.preferred_currency}
              </Typography>
            </CardBody>
          </Card>
          <Card className=" w-1/3 h-[calc(100%-0.5rem)]">
            <CardBody className="flex flex-col justify-between">
              <div className={"flex w-full justify-between"}>
                <Typography variant="body2">Transactions</Typography>
                <IconButton>
                  <ReceiptLongIcon />
                </IconButton>
              </div>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {user.transactions.length}
              </Typography>
            </CardBody>
          </Card>
        </div>
        <Card className=" w-full h-3/4">
          <TransactionTable user={user} />
        </Card>
      </div>
    </div>
  );
}
