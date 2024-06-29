import { Inter } from "next/font/google";
import data from "../util/mock.json"
import Payment from "@/components/Payment";
import { Card } from "@nextui-org/react";
import TransactionTable from "@/components/TransactionTable";

const inter = Inter({ subsets: ['latin'] });

export default function Transactions() {
    const user = data.user;


    return (
        <div className="flex m-8 justify-between h-[calc(100vh-128px)]">
            <div className="w-4/6 h-full" >
                <TransactionTable user={user}/>
            </div>
            <div className="w-[calc(100%-(66%+4rem))]">
                <Card className="bg-black w-full h-3/5 mb-8" ></Card>
                <Card className="bg-black w-full h-[calc(100%-(60%+2rem))] " ></Card>
            </div>
        </div>
    );
}
