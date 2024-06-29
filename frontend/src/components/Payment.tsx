import { Button, Divider } from "@nextui-org/react";
import Link from "next/link";

const Payment = () => {
    return (
        <div className="flex ">
            <div className="w-1/2 flex flex-col justify-between items-center">
                <div>
                    Do you want to send money to one of your contacts?
                </div>
                <Button color="primary" className="w-1/2 ">Send Money</Button>
            </div>
            <Divider orientation="vertical" className="h-40 mr-2 ml-2"/>
            <div className="w-1/2 flex flex-col justify-between items-center">
                <div>
                    You dont have added a contact yet?
                </div>
                <Link href="/contacts" className="mb-1 text-pink-600">Add contact</Link>
            </div>
        </div>
    )
}
export default Payment;