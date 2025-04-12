# CredLink - Blockchain Resume Verification System

CredLink is a decentralized application for verifying educational and professional credentials using blockchain technology.

## Features

- Issue verifiable credentials on the blockchain
- Verify credentials using unique credential IDs
- Manage credential issuers (add/remove)
- Revoke credentials when necessary
- View user credentials history
- Sepolia testnet integration

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask wallet with Sepolia testnet configured
- Sepolia testnet ETH tokens for gas fees (available from faucets)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/verify-chain.git
   cd verify-chain
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Environment configuration:
   - Copy `.env.example` to `.env.local`:
     ```
     cp .env.example .env.local
     ```
   - Fill in your environment variables in `.env.local`:
     - PRIVATE_KEY: Your wallet's private key (never commit this!)
     - ALCHEMY_API_KEY: Create one at https://www.alchemy.com/
     - ETHERSCAN_API_KEY: Get one from https://etherscan.io/myapikey
     - Firebase credentials (if using Firebase)

4. Contract deployment (if needed):
   ```
   npx hardhat compile
   npx hardhat run scripts/deploy-sepolia.js --network sepolia
   ```
   - After deployment, update your `.env.local` with the new contract address
   - A contract is already deployed at: `0x78c5a4e2Fd106dB3BcD852c6A3Db22881F83EF9B`

5. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Smart Contract

The application uses the `CredentialRegistry` smart contract deployed on the Sepolia testnet. The contract address should be specified in your `.env.local` file as `NEXT_PUBLIC_CONTRACT_ADDRESS`.

### Current Deployment
The contract is currently deployed on Sepolia at `0x78c5a4e2Fd106dB3BcD852c6A3Db22881F83EF9B` and verified on [Etherscan](https://sepolia.etherscan.io/address/0x78c5a4e2Fd106dB3BcD852c6A3Db22881F83EF9B).

### Contract Features
- Register and manage credential issuers
- Issue verifiable credentials on-chain
- Verify credential authenticity
- Revoke credentials when necessary
- Track credential ownership and history

## Using the Application

### For Issuers:
- Register as an issuer (requires admin approval)
- Create and issue verifiable credentials
- Revoke credentials when necessary

### For Credential Holders:
- Connect wallet to view your credentials
- Share credential IDs for verification

### For Verifiers:
- Verify credentials using credential IDs
- Check issuer registration status

## Development

- The web3 integration is handled in `src/utils/web3.ts`
- UI components are located in `src/components`
- Pages are defined in `src/pages`

## Security Notes

- **NEVER commit your `.env` or `.env.local` files** - they contain sensitive keys
- **NEVER share your private key** with anyone
- Both `.env` and `.env.local` are already added to `.gitignore`
- The contract owner has admin privileges - keep the owner's private key secure

## License

[MIT](https://choosealicense.com/licenses/mit/)
