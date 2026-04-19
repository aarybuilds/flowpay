'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Login } from '@/components/auth/Login';

export default function ConnectPage() {
  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#080808' }}
    >
      {/* Background glows */}
<<<<<<< Updated upstream
      <div className="absolute pointer-events-none" style={{ top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(107,92,231,0.12) 0%, transparent 70%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '0', right: '20%', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(124,110,255,0.07) 0%, transparent 70%)' }} />
=======
      <div className="absolute pointer-events-none" style={{ top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(184,115,51,0.1) 0%, transparent 70%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '0', right: '20%', width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(194,90,42,0.06) 0%, transparent 70%)' }} />
>>>>>>> Stashed changes

      {/* FlowPay logo above card */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link href="/">
          <span
            className="text-3xl font-black cursor-pointer"
<<<<<<< Updated upstream
            style={{ background: 'linear-gradient(135deg, #A99BFF 0%, #7C6EFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
=======
            style={{ background: 'linear-gradient(135deg, #B87333 0%, #C25A2A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
>>>>>>> Stashed changes
          >
            FlowPay
          </span>
        </Link>
      </motion.div>

      {/* Auth Component */}
      <Login />
    </div>
  );
}
