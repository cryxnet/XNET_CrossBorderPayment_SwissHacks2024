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
            height: "calc(100vh - 64px)",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
        }}>
            <Typography variant="h4">Hello, {user.first_name} {user.last_name}</Typography>

            <Box sx={{ display: "flex", flex: 1, gap: "20px" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                    <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                        <CardContent sx={{ textAlign: 'left', paddingBottom: 0 }}>
                            <Typography variant="overline">Current balance is:</Typography>
                        </CardContent>
                        <CardContent sx={{ textAlign: 'center', paddingTop: 0 }}>
                            <Typography variant="h6">${user.balance.toFixed(2)} {user.preferred_currency}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                        <CardContent sx={{ textAlign: 'left', paddingBottom: 0 }}>
                            <Typography variant="overline">Total Fees Paid:</Typography>
                        </CardContent>
                        <CardContent sx={{ textAlign: 'center', paddingTop: 0 }}>
                            <Typography variant="h6">${user.fees_paid.toFixed(2)}</Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Card sx={{ flex: 2 }}>
                    <CardContent>
                        <Typography variant="overline">Last Transactions:</Typography>
                        <List>
                            {user.transactions.map((transaction, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={`$${transaction.amount.toFixed(2)} - ${transaction.received ? 'Received from' : 'Sent to'} ${getContactName(transaction.contact_id)}`}
                                        secondary={`on ${transaction.date}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>

            <Card sx={{ flexGrow: 1 }}>
                <CardContent sx={{ paddingBottom: 0 }}>
                    <Typography variant="overline">Last Alert:</Typography>
                </CardContent>
                <CardContent sx={{ overflowY: 'auto', maxHeight: '250px' }}>
                    <List sx={{ maxHeight: '100%', overflow: 'auto' }}>
                        {user.alerts.map((alert, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={alert.title}
                                    secondary={alert.message}
                                    primaryTypographyProps={{ style: { fontWeight: 'bold', color: alert.severity === 'error' ? 'red' : 'orange' } }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
}