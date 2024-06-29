import { Client, Wallet, Payment, PathFindCreateRequest, Amount, dropsToXrp } from 'xrpl';
import {
  TEUR_CURRENCY_CODE,
  TEUR_ISSUER_WALLET_ADDRESS,
  TCHF_CURRENCY_CODE,
  TCHF_ISSUER_WALLET_ADDRESS,
} from './tokens';
import {
  bobWallet,
  STEF_WALLET_ADDRESS,
} from './wallets';

// Connect to the XRPL Testnet
const client = new Client('wss://s.altnet.rippletest.net:51233');

async function crossBorderTransaction() {
  await client.connect();

  const senderWallet = bobWallet; // User who sends TCHF
  const recipientAddress = STEF_WALLET_ADDRESS; // Replace with the recipient's address

  try {
    // Step 1: Find path for TCHF to XRP
    const pathFindRequestTCHFtoXRP: PathFindCreateRequest = {
      command: 'path_find',
      subcommand: 'create',
      source_account: senderWallet.address,
      destination_account: senderWallet.address, // Temporary destination
      destination_amount: {
        issuer: T
        currency: 'XRP',
      },
      send_max: {
        currency: TCHF_CURRENCY_CODE,
        value: '10', // Sending 10 TCHF
        issuer: TCHF_ISSUER_WALLET_ADDRESS,
      },
    };

    const pathFindResponseTCHFtoXRP = await client.request(pathFindRequestTCHFtoXRP);

    if (pathFindResponseTCHFtoXRP.result.alternatives.length === 0) {
      throw new Error('No path found for TCHF to XRP conversion.');
    }

    const bestPathTCHFtoXRP = pathFindResponseTCHFtoXRP.result.alternatives[0];

    // Step 2: Perform the payment for TCHF to XRP
    const swapTCHFtoXRP: Payment = {
      TransactionType: 'Payment',
      Account: senderWallet.address,
      Destination: senderWallet.address, // Use the sender's wallet as a placeholder destination
      Amount: bestPathTCHFtoXRP.destination_amount as Amount,
      SendMax: {
        currency: TCHF_CURRENCY_CODE,
        value: '10', // Sending 10 TCHF
        issuer: TCHF_ISSUER_WALLET_ADDRESS,
      },
      Paths: bestPathTCHFtoXRP.paths_computed,
    };

    const swapTCHFtoXRPResponse = await client.submitAndWait(swapTCHFtoXRP, {
      wallet: senderWallet,
      autofill: true,
      failHard: true,
    });

    if (swapTCHFtoXRPResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`Failed to swap TCHF to XRP: ${swapTCHFtoXRPResponse.result.meta.TransactionResult}`);
    }

    console.log('Swap TCHF to XRP successful:', swapTCHFtoXRPResponse);
    console.log(`Transaction link: https://testnet.xrpl.org/transactions/${swapTCHFtoXRPResponse.result.hash}`);

    // Get the amount of XRP received
    const receivedXRP = swapTCHFtoXRPResponse.result.meta.delivered_amount as string;
    console.log(`Received XRP: ${receivedXRP}`);

    // Step 3: Find path for XRP to TEUR
    const pathFindRequestXRPtoTEUR: PathFindCreateRequest = {
      command: 'path_find',
      subcommand: 'create',
      source_account: senderWallet.address,
      destination_account: recipientAddress, // Recipient's address
      destination_amount: {
        currency: TEUR_CURRENCY_CODE,
        issuer: TEUR_ISSUER_WALLET_ADDRESS,
        value: dropsToXrp(receivedXRP), // Amount in TEUR you expect to receive
      },
      source_currencies: [
        {
          currency: 'XRP',
        },
      ],
    };

    const pathFindResponseXRPtoTEUR = await client.request(pathFindRequestXRPtoTEUR);

    if (pathFindResponseXRPtoTEUR.result.alternatives.length === 0) {
      throw new Error('No path found for XRP to TEUR conversion.');
    }

    const bestPathXRPtoTEUR = pathFindResponseXRPtoTEUR.result.alternatives[0];

    // Step 4: Perform the payment for XRP to TEUR
    const swapXRPtoTEUR: Payment = {
      TransactionType: 'Payment',
      Account: senderWallet.address,
      Destination: recipientAddress, // Send directly to the friend's wallet
      Amount: bestPathXRPtoTEUR.destination_amount as Amount,
      SendMax: {
        currency: 'XRP',
        value: receivedXRP,
      },
      Paths: bestPathXRPtoTEUR.paths_computed,
    };

    const swapXRPtoTEURResponse = await client.submitAndWait(swapXRPtoTEUR, {
      wallet: senderWallet,
      autofill: true,
      failHard: true,
    });

    if (swapXRPtoTEURResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`Failed to swap XRP to TEUR: ${swapXRPtoTEURResponse.result.meta.TransactionResult}`);
    }

    console.log('Swap XRP to TEUR and send to recipient successful:', swapXRPtoTEURResponse);
    console.log(`Transaction link: https://testnet.xrpl.org/transactions/${swapXRPtoTEURResponse.result.hash}`);

  } catch (error) {
    console.error('Error in cross-border transaction:', error);
  } finally {
    await client.disconnect();
  }
}

crossBorderTransaction().catch(console.error);
