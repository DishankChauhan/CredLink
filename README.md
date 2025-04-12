# VerifyChain - Blockchain Resume Verification System

VerifyChain is a decentralized application for verifying educational and professional credentials using blockchain technology.

## Features

- Issue verifiable credentials on the blockchain
- Verify credentials using unique credential IDs
- Manage credential issuers (add/remove)
- Revoke credentials when necessary
- View user credentials history
- Mumbai testnet integration

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask wallet with Mumbai testnet configured
- Mumbai testnet MATIC tokens for gas fees

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
   - Fill in your environment variables in `.env.local`

4. Contract deployment (if needed):
   ```
   npx hardhat compile
   npx hardhat run scripts/deploy.ts --network mumbai
   ```
   - After deployment, update your `.env.local` with the new contract address

5. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Smart Contract

The application uses the `CredentialRegistry` smart contract deployed on the Mumbai testnet. The contract address should be specified in your `.env.local` file as `NEXT_PUBLIC_CONTRACT_ADDRESS`.

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

## License

[MIT](https://choosealicense.com/licenses/mit/)
