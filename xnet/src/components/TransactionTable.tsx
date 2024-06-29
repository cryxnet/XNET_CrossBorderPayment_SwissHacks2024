import { List, ListItem } from "@mui/material"
import {Chip, Divider, Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react"
import { useEffect, useState } from "react";
import {User} from "@nextui-org/user";

interface NeededProps { firstName: string | undefined, lastName: string | undefined, wallet: string | undefined, profile: string | undefined, amount: number | undefined, date: string | undefined, received: boolean | undefined }

interface TransactionProps {
    contact_id: string;
    date: string;
    received: boolean;
    amount: number;
}

const TransactionTable = (data) => {
    const [transactionInfos, setTransactionInfos] = useState<NeededProps[]>([])

    const getTransactionInfos = (transaction: TransactionProps): NeededProps => {
        const contact = data.user.contacts.find((contact) => contact.id === transaction.contact_id);

        if (contact) {
            return {
                firstName: contact.first_name,
                lastName: contact.last_name,
                profile: contact.profile_picture,
                wallet: contact.wallet_address,
                amount: transaction.amount,
                date: transaction.date,
                received: transaction.received
            }
        }

    }

    useEffect(() => {
        const newTransactionInfos = data.user.transactions?.map((transaction) => getTransactionInfos(transaction)).filter(info => info !== null);
        setTransactionInfos(newTransactionInfos);
    }, [data.user.transactions])

    return (
        <Table fullWidth className="h-full">
            <TableHeader>
                <TableColumn>Contact</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Amount</TableColumn>
            </TableHeader>
            <TableBody>
                {transactionInfos.map((transaction, index) => {
                    return (
                        <TableRow key={index}>
                            <TableCell>
                                <User
                                    avatarProps={{radius: "lg", src: transaction.profile}}
                                    description={<Link href={`https://testnet.xrpl.org/accounts/${transaction.wallet}`} size="sm" isExternal>{transaction.wallet}</Link>}
                                    name={transaction.firstName + " " + transaction.lastName}
                                />
                            </TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell className={"flex justify-start"}>
                                <Chip className="capitalize" color={transaction.received? "success" : "danger"} size="sm" variant="flat">
                                    {transaction.received ? "+" : "-"}{transaction.amount}
                                </Chip>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
export default TransactionTable