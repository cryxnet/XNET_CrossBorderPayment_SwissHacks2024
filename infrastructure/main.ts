import { Client, Wallet, xrpToDrops, TrustSet, Payment, AMMCreate } from 'xrpl'

// Connect to the XRPL Testnet
const client = new Client('wss://s.altnet.rippletest.net:51233')

async function createTokensAndAMMs() {
  await client.connect()

  // Generate wallets for the issuer, Bob, and Stef
  const issuerWallet = Wallet.generate()
  const bobWallet = Wallet.generate()
  const stefWallet = Wallet.generate()
  console.log(`Issuer Wallet Address: ${issuerWallet.address}`)
  console.log(`Bob Wallet Address: ${bobWallet.address}`)
  console.log(`Stef Wallet Address: ${stefWallet.address}`)

  // Fund the issuer, Bob, and Stef wallets using the Testnet faucet (this is a synchronous call)
  await client.fundWallet(issuerWallet)
  await client.fundWallet(bobWallet)
  await client.fundWallet(stefWallet)

  // Set up trust lines for the new tokens
  const trustSeCHF: TrustSet = {
    TransactionType: 'TrustSet',
    Account: bobWallet.address,
    LimitAmount: {
      currency: 'CHF',
      issuer: issuerWallet.address,
      value: '1000000'
    }
  }

  const trustSetEUR: TrustSet = {
    TransactionType: 'TrustSet',
    Account: bobWallet.address,
    LimitAmount: {
      currency: 'EUR',
      issuer: issuerWallet.address,
      value: '1000000'
    }
  }
  // Sign and submit the TrustSet transactions
  await client.submitAndWait(trustSeCHF, { wallet: bobWallet })
  await client.submitAndWait(trustSetEUR, { wallet: bobWallet })

  // Issue CHF to Bob
  const paymentCHF: Payment = {
    TransactionType: 'Payment',
    Account: issuerWallet.address,
    Destination: bobWallet.address,
    Amount: {
      currency: 'CHF',
      value: '10',
      issuer: issuerWallet.address
    },
    Flags: 2147483648
  }

  // Sign and submit the Payment transactions
  await client.submit(paymentCHF, { wallet: issuerWallet })

  console.log('Tokens CHF and EUR have been created and issued.')

  // Create AMMs for CHF/XRP and EUR/XRP pairs
  // AMM for CHF/XRP
  const ammCreateCHF: AMMCreate = {
    TransactionType: 'AMMCreate',
    Account: issuerWallet.address,
    Amount: {
      currency: 'CHF',
      value: '500',
      issuer: issuerWallet.address
    },
    TradingFee: 40,
    Amount2: xrpToDrops('500'),
    Fee: "2000000",
    Flags: 2147483648,
  }

  // AMM for EUR/XRP
  const ammCreateEUR: AMMCreate = {
    TransactionType: 'AMMCreate',
    Account: issuerWallet.address,
    Amount: {
      currency: 'EUR',
      value: '516',
      issuer: issuerWallet.address
    },
    TradingFee: 40,
    Amount2: xrpToDrops('500'),
    Fee: "2000000",
    Flags: 2147483648,
  }

  // Sign and submit the AMMCreate transactions 
  await client.submitAndWait(ammCreateCHF, { wallet: issuerWallet, autofill: true, failHard: true })
  await client.submitAndWait(ammCreateEUR, { wallet: issuerWallet, autofill: true, failHard: true })

  console.log('AMMs for CHF/XRP and EUR/XRP have been created.')

  await client.disconnect()
}

createTokensAndAMMs().catch(console.error)