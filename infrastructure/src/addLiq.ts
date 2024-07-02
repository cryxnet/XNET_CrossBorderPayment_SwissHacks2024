import { Client, Wallet, xrpToDrops, AMMDeposit } from 'xrpl';
import {
  TEUR_CURRENCY_CODE,
  TEUR_DISTRIBUTOR_WALLET_ADDRESS,
  TEUR_DISTRIBUTOR_WALLET_SEED,
  TEUR_ISSUER_WALLET_ADDRESS,
  TCHF_CURRENCY_CODE,
  TCHF_DISTRIBUTOR_WALLET_ADDRESS,
  TCHF_DISTRIBUTOR_WALLET_SEED,
  TCHF_ISSUER_WALLET_ADDRESS
} from './tokens';

// Connect to the XRPL Testnet
const client = new Client('wss://s.altnet.rippletest.net:51233');

async function provideLiquidity() {
  await client.connect();

  const teurDistributorWallet = Wallet.fromSeed(TEUR_DISTRIBUTOR_WALLET_SEED);
  const tchfDistributorWallet = Wallet.fromSeed(TCHF_DISTRIBUTOR_WALLET_SEED);

  // Desired amounts to add
  const additionalTCHF = 30; // 100,000 CHF
  const additionalTEUR = 45; // 120,000 EUR

  // Desired exchange rates
  const teurToXrpRate = 0.45;
  const tchfToXrpRate = 0.43;

  // Calculate the corresponding XRP amounts
  const additionalXRPForTEUR = (additionalTEUR * teurToXrpRate).toFixed(6); // XRP needed for additional TEUR
  const additionalXRPForTCHF = (additionalTCHF * tchfToXrpRate).toFixed(6); // XRP needed for additional TCHF

  // Convert to drops
  const additionalXRPForTEURInDrops = xrpToDrops(additionalXRPForTEUR);
  const additionalXRPForTCHFInDrops = xrpToDrops(additionalXRPForTCHF);

  // Adjust liquidity for TEUR/XRP AMM
  const ammDepositTEUR: AMMDeposit = {
    TransactionType: 'AMMDeposit',
    Account: TEUR_DISTRIBUTOR_WALLET_ADDRESS,
    Asset: {
      currency: TEUR_CURRENCY_CODE,
      issuer: TEUR_ISSUER_WALLET_ADDRESS,
    },
    Asset2: {
      currency: 'XRP',
    },
    Amount: {
      currency: TEUR_CURRENCY_CODE,
      value: additionalTEUR.toString(),
      issuer: TEUR_ISSUER_WALLET_ADDRESS,
    },
    Amount2: additionalXRPForTEURInDrops,
    Fee: '10',
    Flags: 1048576,
  };

  // Adjust liquidity for TCHF/XRP AMM
  const ammDepositTCHF: AMMDeposit = {
    TransactionType: 'AMMDeposit',
    Account: TCHF_DISTRIBUTOR_WALLET_ADDRESS,
    Asset: {
      currency: TCHF_CURRENCY_CODE,
      issuer: TCHF_ISSUER_WALLET_ADDRESS,
    },
    Asset2: {
      currency: 'XRP',
    },
    Amount: {
      currency: TCHF_CURRENCY_CODE,
      value: additionalTCHF.toString(),
      issuer: TCHF_ISSUER_WALLET_ADDRESS,
    },
    Amount2: additionalXRPForTCHFInDrops,
    Fee: '10',
    Flags: 1048576,
  };

  try {
    // Sign and submit the AMMDeposit transaction for TEUR/XRP
    const teurAmmDepositResponse = await client.submitAndWait(ammDepositTEUR, {
      wallet: teurDistributorWallet,
      autofill: true,
      failHard: true,
    });
    console.log('Liquidity provided to TEUR/XRP AMM:', teurAmmDepositResponse);

    // Sign and submit the AMMDeposit transaction for TCHF/XRP
    const tchfAmmDepositResponse = await client.submitAndWait(ammDepositTCHF, {
      wallet: tchfDistributorWallet,
      autofill: true,
      failHard: true,
    });
    console.log('Liquidity provided to TCHF/XRP AMM:', tchfAmmDepositResponse);

  } catch (error) {
    console.error('Error providing liquidity:', error);
  } finally {
    await client.disconnect();
  }
}

provideLiquidity().catch(console.error);
