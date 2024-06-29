import { Inter } from "next/font/google";
import data from "../util/mock.json"
import {Box} from "@mui/material";
import TransactionList from "@/components/TransactionList";


const inter = Inter({ subsets: ['latin'] });

export default function Transactions() {
    const user = data.user;


    return (
        <Box sx={{width: "100%", height: "100%", border: "1px solid red"}}>
            <Box>
                <TransactionList data={user} />
            </Box>
            <Box>

            </Box>
        </Box>
    );
}
