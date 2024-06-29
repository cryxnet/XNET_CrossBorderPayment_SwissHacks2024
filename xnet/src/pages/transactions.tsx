import { Inter } from "next/font/google";
import data from "../util/mock.json";
import Payment from "@/components/Payment";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import TransactionTable from "@/components/TransactionTable";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Transactions() {
  const user = data.user;

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
