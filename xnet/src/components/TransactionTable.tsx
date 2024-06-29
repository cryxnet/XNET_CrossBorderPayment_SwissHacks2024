import { List, ListItem } from "@mui/material"
import {Chip, Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react"
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
        console.log(data.user)
        const newTransactionInfos = data.user.transactions?.map((transaction) => getTransactionInfos(transaction)).filter(info => info !== null);
        setTransactionInfos(newTransactionInfos);
    }, [data.user.transactions])

    return (
        // <List>
        //     {transactionInfos?.map((transactionInfo, index) => {
        //         return (
        //             <div>
        //                 <ListItem alignItems="center" key={index}>
        //                     <div className="w-full flex items-center justify-between">
        //                         <div className="flex w-1/2">
        //                             <div className=" w-1/3 text-ellipsis">{transactionInfo.firstName}</div>
        //                             <div className="w-1/3">{transactionInfo.lastName}</div>
        //                             <div className="w-1/3">{transactionInfo.date}</div>
        //                         </div>
        //                         <div>{transactionInfo.received ? "+" : "-"}{transactionInfo.amount}</div>
        //                     </div>
        //                 </ListItem >

        //                 <Divider />
        //             </div>
        //         )
        //     })}
        // </List>
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
                                    description={transaction.wallet}
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