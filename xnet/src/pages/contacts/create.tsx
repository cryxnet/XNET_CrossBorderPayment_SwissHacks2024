import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Typography } from '@mui/material';

const currencies = [
    { value: 'CAD', label: 'CAD' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
];

const Create = () => {
    const [contact, setContact] = useState({
        first_name: '',
        last_name: '',
        preferred_currency: 'USD',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContact((prevContact) => ({
            ...prevContact,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // handle submit
        setContact({
            first_name: '',
            last_name: '',
            preferred_currency: 'CAD',
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: "center",
                justifyContent: "center",
                gap: '15px',
                width: '100%',
                height: "100%",
                maxWidth: '500px',
                margin: 'auto',
            }}
        >                <Typography variant="h6">Create Contact</Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: "15px",
                width: "100%"
            }}>
                <TextField
                    label="First Name"
                    name="first_name"
                    value={contact.first_name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Last Name"
                    name="last_name"
                    value={contact.last_name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    select
                    label="Preferred Currency"
                    name="preferred_currency"
                    value={contact.preferred_currency}
                    onChange={handleChange}
                    required
                >
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <Button type="submit" variant="contained" color="primary">
                    Create
                </Button>
            </Box>
        </Box>
    );
};

export default Create;