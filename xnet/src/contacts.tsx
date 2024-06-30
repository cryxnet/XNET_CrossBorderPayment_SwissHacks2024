import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Button,
    useDisclosure
} from "@nextui-org/react";
import data from "@/util/mock.json";
import { FiEye } from "react-icons/fi";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {useState} from "react";
import {set} from "@internationalized/date/src/manipulation";
import {Box} from "@mui/material"; // Import the eye icon from react-icons

export default function Contacts() {
    const contact = data.user;
    const columns = [
        { key: "first_name", label: "First Name" },
        { key: "last_name", label: "Last Name" },
        { key: "preferred_currency", label: "Preferred Currency" },
        { key: "view", label: "View" }
    ];


    const [selectedContact, setSelectedContact] = useState(null)
    const {isOpen, onOpen, onOpenChange} = useDisclosure();


    const handleView = (id: number) => {
        const selected = contact.contacts.find(c => c.id === id);
        setSelectedContact(selected)
        onOpen()
    }

    return (
        <div className={"w-full h-full flex flex-col p-6"}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <p className={"text-3xl"}>Your Contacts:</p>
                <Button onClick={() => window.location.href = "/contacts/create"} color={"success"}>Add Contact</Button>
            </Box>
            <br/>
            <Table aria-label="Example static collection table">
                <TableHeader>
                    {columns.map(column => (
                        <TableColumn key={column.key}>{column.label}</TableColumn>
                    ))}
                </TableHeader>
                <TableBody>
                    {contact.contacts.map((contact, index) => (
                        <TableRow key={index}>
                            <TableCell>{contact.first_name}</TableCell>
                            <TableCell>{contact.last_name}</TableCell>
                            <TableCell>{contact.preferred_currency}</TableCell>
                            <TableCell>
                                <Button auto flat icon={<FiEye />} onClick={() => handleView(contact.id) } >View</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Contact</ModalHeader>
                            <ModalBody>
                                Firstname: {" " +selectedContact.first_name}
                                <br/>
                                <br/>
                                Lastname: {" " +selectedContact.last_name}
                                <br/>
                                <br/>
                                Currency: {" " +selectedContact.preferred_currency}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
</div>
    );
}