import { Card, CardBody, CardHeader, Divider, Listbox, ListboxItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { Inter } from "next/font/google";
import data from "../util/mock.json"
import { useEffect, useRef, useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";

const inter = Inter({ subsets: ['latin'] });

interface NeededProps { firstName: string | undefined, lastName: string | undefined, amount: number | undefined, date: string | undefined, received: boolean | undefined }

interface TransactionProps {
    contact_id: string;
    date: string;
    received: boolean;
    amount: number;
}

export default function Transactions() {
    const user = data.user;
    const [transactionInfos, setTransactionInfos] = useState<NeededProps[]>([])

    const getTransactionInfos = (transaction: TransactionProps): NeededProps => {
        const contact = user.contacts.find((contact) => contact.id === transaction.contact_id);

        if (contact) {
            return {
                firstName: contact.first_name,
                lastName: contact.last_name,
                amount: transaction.amount,
                date: transaction.date,
                received: transaction.received
            }
        }
    }

    useEffect(() => {
        const newTransactionInfos = user.transactions.map((transaction) => getTransactionInfos(transaction)).filter(info => info !== null);
        setTransactionInfos(newTransactionInfos);
    }, [user.transactions])

    return (
        <Card isBlurred className="m-4 bg-slate-300 h-[calc(100vh-96px)] w-2/5">
            <CardBody>
                <List>
                    {transactionInfos.map((transactionInfo, index) => {
                        return (
                            <div>
                                <ListItem alignItems="center" key={index}>
                                    <div className="w-full flex items-center justify-between">
                                        <div className="flex w-1/2">
                                            <div className=" w-1/3 text-ellipsis">{transactionInfo.firstName}</div>
                                            <div className="w-1/3">{transactionInfo.lastName}</div>
                                            <div className="w-1/3">{transactionInfo.date}</div>
                                        </div>
                                        <div>{transactionInfo.received ? "+" : "-"}{transactionInfo.amount}</div>
                                    </div>
                                </ListItem >

                                <Divider />
                            </div>
                        )
                    })}
                </List>
            </CardBody>
        </Card>
    );
}
