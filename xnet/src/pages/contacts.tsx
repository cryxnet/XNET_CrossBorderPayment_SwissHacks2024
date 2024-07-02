import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Button as NextButton,
  Input,
  Link,
} from "@nextui-org/react";
import data from "@/util/mock.json";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { useState } from "react";
import { Box, IconButton, Avatar, Button } from "@mui/material";
import {
  AiOutlineEye,
  AiOutlinePlus,
  AiOutlineQrcode,
  AiOutlineLink,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import ConfettiExplosion from "react-confetti-explosion";
import { UserIcon } from "@/components/icons/UserIcon";
import { User } from "@nextui-org/user";

export default function Contacts() {
  const contact = data.user;
  const columns = [
    { key: "last_name", label: "Name" },
    { key: "preferred_currency", label: "Preferred Currency" },
    { key: "view", label: "View" },
  ];

  const [selectedContact, setSelectedContact] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isAddOpen, setAddOpen] = useState(false);
  const [isAddedOpen, setAddedOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    contactCode: "",
  });

  const handleView = (id: number) => {
    const selected = contact.contacts.find((c) => c.id === id);
    setSelectedContact(selected);
    onOpen();
  };

  const handleAddContact = () => {
    setAddOpen(true);
  };

  const handleAddClose = () => {
    setAddOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    handleAddClose();
    setAddedOpen(true);
  };

  const handleAddedClose = () => {
    setAddedOpen(false);
  };

  const generateInviteLink = () => {
    return `https://example.com/invite?code=${newContact.contactCode}`;
  };

  return (
    <div className="w-[calc(100%-32px)] h-[calc(100%-32px)] flex flex-col m-4">
      <div className="flex justify-between w-full mb-4">
        <p className="text-3xl">Contacts</p>

        <NextButton
          color="primary"
          onClick={handleAddContact}
          variant="bordered"
          startContent={<UserIcon />}
        >
          Add contact
        </NextButton>
      </div>
      <Table
        aria-label="Example static collection table"
        className="h-[calc(100%-72px)]"
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {contact.contacts.map((contact, index) => (
            <TableRow key={index}>
              <TableCell>
                <User
                  avatarProps={{ radius: "lg", src: contact.profile_picture }}
                  description={
                    <Link
                      href={`https://testnet.xrpl.org/accounts/${contact.wallet_address}`}
                      size="sm"
                      isExternal
                    >
                      {contact.wallet_address}
                    </Link>
                  }
                  name={contact.first_name + " " + contact.last_name}
                ></User>
              </TableCell>
              <TableCell>{contact.preferred_currency}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleView(contact.id)}>
                  <AiOutlineEye />
                </IconButton>
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
                Firstname:{" "}
                {" " + (selectedContact ? selectedContact.first_name : "")}
                <br />
                <br />
                Lastname:{" "}
                {" " + (selectedContact ? selectedContact.last_name : "")}
                <br />
                <br />
                Currency:{" "}
                {" " +
                  (selectedContact ? selectedContact.preferred_currency : "")}
              </ModalBody>
              <ModalFooter>
                <NextButton color="error" variant="light" onPress={onClose}>
                  Close
                </NextButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isAddOpen} onOpenChange={setAddOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Contact
              </ModalHeader>
              <ModalBody>
                <Input
                  fullWidth
                  label="Firstname"
                  name="firstName"
                  value={newContact.firstName}
                  onChange={handleInputChange}
                  margin="dense"
                />
                <Input
                  fullWidth
                  label="Lastname"
                  name="lastName"
                  value={newContact.lastName}
                  onChange={handleInputChange}
                  margin="dense"
                />
                <Input
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={newContact.phoneNumber}
                  onChange={handleInputChange}
                  margin="dense"
                />
                <Input
                  fullWidth
                  label="Contact Code"
                  name="contactCode"
                  value={newContact.contactCode}
                  onChange={handleInputChange}
                  margin="dense"
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    startIcon={<AiOutlineLink />}
                    onClick={() =>
                      window.alert(`Invite link: ${generateInviteLink()}`)
                    }
                  >
                    Share Invite Link
                  </Button>
                  <Button
                    startIcon={<AiOutlineQrcode />}
                    onClick={() =>
                      window.alert("QR Code functionality not implemented yet")
                    }
                  >
                    Scan QR Code
                  </Button>
                </Box>
              </ModalBody>
              <ModalFooter>
                <NextButton
                  color="primary"
                  variant="light"
                  onPress={handleSave}
                >
                  Save
                </NextButton>
                <NextButton
                  color="error"
                  variant="light"
                  onPress={handleAddClose}
                >
                  Close
                </NextButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isAddedOpen} onOpenChange={setAddedOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center justify-center">
                <AiOutlineCheckCircle size={50} color="green" />
                <span>Contact Added</span>
              </ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
                <p>Your contact has been added successfully!</p>
                <ConfettiExplosion zIndex={50} />
              </ModalBody>
              <ModalFooter>
                <NextButton
                  color="primary"
                  variant="light"
                  onPress={handleAddedClose}
                >
                  Close
                </NextButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
