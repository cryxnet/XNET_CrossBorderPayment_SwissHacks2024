import { List, ListItem } from "@mui/material"
import { Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { useEffect, useState } from "react";

interface NeededProps { firstName: string | undefined, lastName: string | undefined, amount: number | undefined, date: string | undefined, received: boolean | undefined }

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
                <TableColumn>First Name</TableColumn>
                <TableColumn>Last Name</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Amount</TableColumn>
            </TableHeader>
            <TableBody>
                {transactionInfos.map((transaction, index) => {
                    return (
                        <TableRow key={index}>
                            <TableCell>{transaction.firstName}</TableCell>
                            <TableCell>{transaction.lastName}</TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.received ? "+" : "-"}{transaction.amount}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
export default TransactionTable