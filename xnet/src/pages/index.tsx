import { Card, CardContent, List, ListItem, ListItemText, Box, Typography } from '@mui/material';
import data from '@/util/mock.json';

export default function Home() {
    const user = data.user;

    const getContactName = (contactId) => {
        const contact = user.contacts.find(contact => contact.id === contactId);
        return contact ? `${contact.first_name} ${contact.last_name}` : 'Unknown';
    };

    return (
        <Box sx={{
            width: "100%",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
        }}>
            <Typography variant="h4">Hello, {user.first_name} {user.last_name}</Typography>

            <Box className={"flex flex-col gap-5 h-full"}>
                <Box className={"flex gap-5"}>
                    <Box className={"w-full"}>
                        <Card>
                            <CardContent>
                                Hello
                            </CardContent>
                        </Card>
                    </Box>
                    <Box className={"w-full"}>
                        <Card>
                            <CardContent>
                                Hello
                            </CardContent>
                        </Card>
                    </Box>
                    <Box className={"w-full"}>
                        <Card>
                            <CardContent>
                                Hello
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                <Card className={"w-full h-full"}>
                    <CardContent>
                        Hello
                    </CardContent>
                </Card>
            </Box>

        </Box>
    );
}