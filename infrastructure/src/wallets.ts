import { Wallet } from 'xrpl';

export const BOB_WALLET_ADDRESS = "r3SjGyriThUJ5p7xfK5JD9t1TzG43Njs8h"
export const BOB_WALLET_SECRET = "sEdTywhfPbfYL8xnAcEc4AXn2pXy2Yx"

export const STEF_WALLET_ADDRESS = "rU2JuuNewAXCDfmvi7Fkbnuof8UV9QLu4L"
export const STEF_WALLET_SECRET = "sEd7kp863GThPejGuxJQFUXHvkEVNYT"

// Create wallets from seeds
export const bobWallet = Wallet.fromSeed(BOB_WALLET_SECRET);
export const stefWallet = Wallet.fromSeed(STEF_WALLET_SECRET);