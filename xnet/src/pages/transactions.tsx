import { Inter } from "next/font/google";
import data from "../util/mock.json";
import Payment from "@/components/Payment";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import TransactionTable from "@/components/TransactionTable";
import Link from "next/link";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Transactions() {
  const user = data.user;
  const [transactions, setTransactions] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const walletAddress = "rDBg1qLgTFaYQ8R5U9bh8QXLv7ErFgWXz2";

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(
          `/api/user/transactions?walletAddress=${walletAddress}`
        );
        const data = await response.json();
        console.log({ transactions: data });
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    fetchTransactions();
  }, [walletAddress]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(
          `/api/user/info?walletAddress=${walletAddress}`
        );
        const data = await response.json();
        console.log({ user: data });
        setUserInfo(data.user);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    fetchTransactions();
  }, [walletAddress]);

  return (
    <div className="flex m-8 justify-between h-[calc(100vh-128px)]">
      <div className="w-4/6 h-full">
        <TransactionTable user={user} />
      </div>
      <div className="w-[calc(100%-(66%+4rem))]">
          <div className=" w-full h-3/5 mb-8">
            <Payment/>
          </div>
        <Card className="w-full h-[calc(100%-(60%+2rem))]">
          <CardHeader>Add a contact</CardHeader>
          <CardBody className="flex justify-between items-center">
            <p className="text-center">
              To use the money transfer function, the recipient must already be
              added to your contacts. To add a contact, please add one with
              clicking here.
            </p>
            <Button color="primary" className="w-1/2">
              <Link href="/contacts/create">Create Contact</Link>
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
