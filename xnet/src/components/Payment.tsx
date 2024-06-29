import {Avatar, Button, Divider, SelectItem, Select, Chip, Input, Card} from "@nextui-org/react";
import Link from "next/link";
import {Box, MenuItem, Paper, Typography, TextField, InputLabel} from "@mui/material";
import data from "@/util/mock.json"
import {FormControl} from "@mui/base";
import {useState} from "react";
import {useTypeSelect} from "@react-aria/selection";
import {CardBody, CardHeader} from "@nextui-org/card";
const Payment = () => {
    const user = data.user


    const [contact, setContact] = useState(null);
    const [sendAmount, setSendAmount] = useState(null)
    const [recieveAmount, setRecieveAmount] = useState(null)

    const isDisabled = sendAmount == 0 || recieveAmount == 0 || !contact

    const handleSelect = ($event) =>{
        setContact(user.contacts.find(c1 => c1.id == $event.target.value))
        setSendAmount(0)
        setRecieveAmount(0)
    }

    const handleMoneyChange = ($event) => {
        console.log($event.target.value)
        setSendAmount($event.target.value)
        if (contact){
            // handle recieve money exchange value
            setRecieveAmount($event.target.value)

        }else{
            setRecieveAmount($event.target.value)
        }
    }

    const handleSubmit = () =>{

    }

    return (
        <Card sx={{padding: "15px", width: "100%", height: "100%"}}>
            <CardHeader>
                <p variant={"h6"}>Make Payment</p>
            </CardHeader>
            <CardBody>
                <Box className={"flex flex-col gap-5"}>
                    <Select
                        onChange={handleSelect}
                        items={user.contacts}
                        label="Reciever"
                        placeholder="Select reciever"
                        labelPlacement="outside"
                        classNames={{
                            base: "max-w",
                            trigger: "min-h-12 py-2",
                        }}
                        renderValue={(items) => {
                            return (
                                <div className="flex flex-wrap gap-2">
                                    {items.map((item) => (
                                        <div className="flex gap-2 items-center">
                                            <Avatar alt={item.data.first_name} className="flex-shrink-0" size="sm"
                                                    src={item.data.profile_picture}/>
                                            <div className="flex flex-col">
                                                <span className="text-small">{item.data.first_name + " " + item.data.last_name}</span>
                                                <span className="text-tiny text-default-400">{item.data.wallet_address}</span>
                                            </div>
                                        </div>))}
                                </div>
                            );
                        }}
                    >
                        {(user) => (
                            <SelectItem key={user.id} value={user.id}>
                                <div className="flex gap-2 items-center">
                                    <Avatar alt={user.first_name} className="flex-shrink-0" size="sm"
                                            src={user.profile_picture}/>
                                    <div className="flex flex-col">
                                        <span className="text-small">{user.first_name + " " + user.last_name}</span>
                                        <span className="text-tiny text-default-400">{user.wallet_address}</span>
                                    </div>
                                </div>
                            </SelectItem>
                        )}
                    </Select>
                    <Input type={"number"} label={"Amount send"}
                           onChange={handleMoneyChange}
                           classNames={{
                               base: "max-w",
                               trigger: "min-h-12 py-2",
                           }}
                           value={sendAmount}
                           endContent={
                               <Typography>{user.preferred_currency}</Typography>
                           }
                    />

                    <Input type={"number"} label={"Amount recieve"}
                           disabled={true}
                           value={recieveAmount}
                           classNames={{
                               base: "max-w",
                               trigger: "min-h-12 py-2",
                           }}
                           endContent={
                               <Typography>{contact? contact.preferred_currency : ""}</Typography>
                }
                    />
                    <Button color={isDisabled? "default":"success"} disabled={isDisabled} onClick={handleSubmit}>
                        Authorize Payment
                    </Button>
                </Box>
            </CardBody>
        </Card>
    )
}
export default Payment;