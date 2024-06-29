import { Card, CardBody } from "@nextui-org/react";
import { Inter } from "next/font/google";
import data from "../util/mock.json"
import TransactionList from "@/components/TransactionList";
import Payment from "@/components/Payment";

const inter = Inter({ subsets: ['latin'] });

export default function Transactions() {
    const user = data.user;


    return (
        <div className="flex justify-around items-center h-[calc(100vh-96px)]">
            <Card isBlurred className="m-4 min-h-72 w-2/5">
                <CardBody>
                    <TransactionList user={user} />
                </CardBody>
            </Card>
            <Card isBlurred className="m-4 h-48 w-2/5">
                <CardBody>
                    <Payment />
                </CardBody>
            </Card>
        </div>
    );
}
