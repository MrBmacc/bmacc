# BMACC (Buy Me A Crypto Coffee) ☕️

BMACC is a decentralized application (dApp) that enables creators and content producers to receive cryptocurrency tips through a simple link or QR code. Built on the Base network, BMACC eliminates intermediaries while maintaining transparency in transactions.

## 🚀 Features

- Direct crypto tipping functionality
- QR code generation for easy sharing
- Support for multiple tokens (USDC, BMACC, native tokens)
- Responsive design for both mobile and desktop
- Web3 wallet integration
- Real-time balance tracking

## 🛠 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Type Safety**: TypeScript
- **Web3 Integration**: 
  - Wagmi
  - Viem
  - @reown/appkit
- **Routing**: TanStack Router
- **State Management**: Zustand
- **Database**: Supabase
- **UI Components**: 
  - Radix UI
  - Framer Motion
  - Lucide React icons

## 🏗 Project Structure

The project follows a modern React application structure with TypeScript support:

├── public/
│ ├── images/
│ │ └── bmacc-logo.png
│ └── redirects
├── src/
│ ├── assets/
│ │ └── bmacc-character-in-room.png
│ ├── components/
│ │ ├── ui/
│ │ ├── page-landing.tsx
│ │ ├── provider-appkit.tsx
│ │ └── section-testimonials.tsx
│ ├── config/
│ │ └── abi/
│ │ ├── cryptoTippingAbi.ts
│ │ └── erc20.json
│ ├── hooks/
│ │ └── use-user-balance.ts
│ ├── lib/
│ │ ├── supabase.ts
│ │ └── utils.ts
│ ├── main.tsx
│ └── router.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
├── tailwind.config.js
└── components.json

## 🚦 Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_PROJECT_ID=your_web3_project_id
```

4. Run the development server:
```bash
npm run dev
```

## 🔗 Important Links

- [Website](https://www.bmacc.io)
- [Telegram Community](https://t.me/BMACC_Official)
- [Base Network](https://www.base.org/)








