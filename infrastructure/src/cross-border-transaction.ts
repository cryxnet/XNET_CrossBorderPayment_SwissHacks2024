import { Client, Wallet, Payment, xrpToDrops } from 'xrpl';
import { } from './wallets'
import { } from './tokens'
const client = new Client('wss://s1.ripple.com'); // Use the testnet URL if you're testing
const senderSecret = 'YOUR_SENDER_SECRET';
const senderAddress = 'YOUR_SENDER_ADDRESS';
const recipientAddress = 'RECIPIENT_ADDRESS';
const wallet = Wallet.fromSeed(senderSecret);

const sourceCurrency = 'TCHF';
const destinationCurrency = 'TEUR';
const amountToSend = '10'; // 10 TCHF

(async () => {
    await client.connect();
  })();
  

  (async () => {
    await client.connect();
  
    const payment: Payment = {
      TransactionType: 'Payment',
      Account: senderAddress,
      Amount: {
        currency: destinationCurrency,
        value: amountToSend,
        issuer: recipientAddress
      },
      Destination: recipientAddress,
      SendMax: {
        currency: sourceCurrency,
        value: amountToSend,
        issuer: senderAddress
      },
      Paths: [
        [
          {
            currency: 'XRP'
          },
          {
            currency: destinationCurrency,
            issuer: recipientAddress
          }
        ]
      ]
    };
  
    // Sign and submit the transaction
    const prepared = await client.autofill(payment);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
  
    console.log(result);
  
    await client.disconnect();
  })();
  