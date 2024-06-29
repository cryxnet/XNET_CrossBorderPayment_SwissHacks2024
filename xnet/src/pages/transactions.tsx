import { Inter } from "next/font/google";
import data from "../util/mock.json"
import TransactionTable from "@/components/TransactionList";
import Payment from "@/components/Payment";
import { Card } from "@nextui-org/react";

const inter = Inter({ subsets: ['latin'] });

export default function Transactions() {
    const user = data.user;


    return (
        <div className="flex m-8 justify-between h-[calc(100vh-128px)]">
            <Card className="bg-black w-4/6 h-full" ></Card>
            <div className="w-[calc(100%-(66%+4rem))]">
                <Card className="bg-black w-full h-3/5 mb-8" ></Card>
                <Card className="bg-black w-full h-[calc(100%-(60%+2rem))] " ></Card>
            </div>
        </div>
    );
}
