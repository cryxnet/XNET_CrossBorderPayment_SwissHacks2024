import { Client, Wallet, xrpToDrops, dropsToXrp, AMMCreate } from 'xrpl';
import {
  TEUR_CURRENCY_CODE,
  TEUR_DISTRIBUTOR_WALLET_ADDRESS,
  TEUR_DISTRIBUTOR_WALLET_SEED,
  TCHF_CURRENCY_CODE,
  TCHF_DISTRIBUTOR_WALLET_ADDRESS,
  TCHF_DISTRIBUTOR_WALLET_SEED,
  TCHF_ISSUER_WALLET_SEED,
  TEUR_ISSUER_WALLET_SEED,
  TEUR_ISSUER_WALLET_ADDRESS,
  TCHF_ISSUER_WALLET_ADDRESS
} from './tokens';

// Connect to the XRPL Testnet
const client = new Client('wss://s.altnet.rippletest.net:51233');

async function createAMMs() {
  await client.connect();

  const teurDistributorWallet = Wallet.fromSeed(TEUR_DISTRIBUTOR_WALLET_SEED);
  const tchfDistributorWallet = Wallet.fromSeed(TCHF_DISTRIBUTOR_WALLET_SEED);

  const teurIssuerWallet = Wallet.fromSeed(TEUR_ISSUER_WALLET_SEED);
  const tchfIssuerWallet = Wallet.fromSeed(TCHF_ISSUER_WALLET_SEED);


  console.log(TEUR Distributor Wallet Address: ${teurDistributorWallet.address});
  console.log(TCHF Distributor Wallet Address: ${tchfDistributorWallet.address});


  // Create AMM for TEUR/XRP
  const ammCreateTEUR: AMMCreate = {
    TransactionType: 'AMMCreate',
    Account: TEUR_DISTRIBUTOR_WALLET_ADDRESS,
    Amount: {
      currency: TEUR_CURRENCY_CODE,
      value: '500', // Adjust as necessary
      issuer: TEUR_ISSUER_WALLET_ADDRESS,
    },
    Amount2: xrpToDrops('32'), // Adjust as necessary
    TradingFee: 40, // 0.04% trading fee
  };

  // Create AMM for TCHF/XRP
  const ammCreateTCHF: AMMCreate = {
    TransactionType: 'AMMCreate',
    Account: TCHF_DISTRIBUTOR_WALLET_ADDRESS,
    Amount: {
      currency: TCHF_CURRENCY_CODE,
      value: '500', // Adjust as necessary
      issuer: TCHF_ISSUER_WALLET_ADDRESS,
    },
    Amount2: xrpToDrops('32'), // Adjust as necessary
    TradingFee: 40, // 0.04% trading fee
  };

  try {
    // Sign and submit the AMMCreate transactions for TEUR/XRP
    const teurAmmResponse = await client.submitAndWait(ammCreateTEUR, {
      wallet: teurDistributorWallet,
      autofill: true,
      failHard: true,
    });
    console.log('AMM for TEUR/XRP created:', teurAmmResponse);

    // Sign and submit the AMMCreate transactions for TCHF/XRP
    const tchfAmmResponse = await client.submitAndWait(ammCreateTCHF, {
      wallet: tchfDistributorWallet,
      autofill: true,
      failHard: true,
    });
    console.log('AMM for TCHF/XRP created:', tchfAmmResponse);

  } catch (error) {
    console.error('Error creating AMMs:', error);
  } finally {
    await client.disconnect();
  }
}

createAMMs().catch(console.error);