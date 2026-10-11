'use client';

import React, { useState } from 'react';
import { useEscrow } from '@/context/EscrowContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import {
  CreditCard,
  Wallet,
  Building,
  ShieldCheck,
  Lock,
  X,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Receipt,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  milestoneId: string;
  amount: number;
  milestoneTitle: string;
  contractTitle: string;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  contractId,
  milestoneId,
  amount,
  milestoneTitle,
  contractTitle,
}) => {
  const { currentUser, refreshUser } = useAuth();
  const { syncWithServer } = useEscrow() as any;

  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'ESCROW_WALLET' | 'WIRE_TRANSFER'>('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Alex Vance');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('883');
  const [zip, setZip] = useState('10001');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [receipt, setReceipt] = useState<any>(null);
  const [copiedTx, setCopiedTx] = useState(false);

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    val = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpiry(val);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep('Contacting Payment Gateway...');

    try {
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStep('Simulating 3D-Secure Bank Handshake & Fraud Scan...');
      await new Promise((r) => setTimeout(r, 700));
      setProcessingStep('Locking Funds into ViewBook Relational Smart Escrow...');

      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId,
          milestoneId,
          paymentMethod,
          cardDetails: {
            cardNumber,
            cardHolder,
            expiry,
            cvv,
          },
          userId: currentUser?.id,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Payment failed');
      }

      setReceipt(json.data.receipt);
      await refreshUser();
      if (syncWithServer) await syncWithServer();

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } catch (err: any) {
      alert(`Payment Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {receipt ? 'Escrow Deposit Confirmed' : 'Lock Escrow Payment'}
              </h3>
              <p className="text-xs text-slate-400">
                {contractId} • {milestoneTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RECEIPT VIEW */}
        {receipt ? (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Funds Successfully Locked</h4>
              <p className="text-xs text-emerald-300">
                {formatCurrency(receipt.amount)} is securely held in ViewBook Smart Escrow.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Receipt ID:</span>
                <span className="text-white font-bold">{receipt.transactionId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Method:</span>
                <span className="text-slate-200">
                  {receipt.method === 'CREDIT_CARD'
                    ? `Card (ending ${receipt.cardLast4 || '4242'})`
                    : 'Sovereign Escrow Wallet'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Timestamp:</span>
                <span className="text-slate-300">{receipt.timestamp}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-slate-500 text-[10px] uppercase">SHA-256 Signature:</span>
                <div className="flex items-center gap-1">
                  <span className="text-emerald-400 text-[11px] truncate max-w-[200px]">
                    {receipt.txHash}
                  </span>
                  <button
                    onClick={() => handleCopyHash(receipt.txHash)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {copiedTx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
              <strong>Freelancer Authorization:</strong> The provider has been authorized to proceed.
              You will inspect the unwatermarked preview in the ViewBook Vault once submitted.
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition"
            >
              Return to Project Console
            </button>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
            {/* Amount Callout */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-xs text-slate-400">Milestone Deposit</span>
                <h4 className="text-xs font-semibold text-white truncate max-w-[260px]">
                  {milestoneTitle}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-emerald-300">
                  {formatCurrency(amount)}
                </span>
                <span className="text-[10px] text-slate-500 block">Zero Escrow Fee</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Select Funding Source</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Credit / Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ESCROW_WALLET')}
                  className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 transition ${
                    paymentMethod === 'ESCROW_WALLET'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Wallet className="w-4 h-4 text-blue-400" />
                    <span className="truncate">Escrow Wallet</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-300 shrink-0">
                    {formatCurrency(currentUser?.balance || 0)}
                  </span>
                </button>
              </div>
            </div>

            {/* Credit Card Inputs */}
            {paymentMethod === 'CREDIT_CARD' && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500 pr-10"
                    />
                    <CreditCard className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-300">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-300">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="•••"
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Info Notice */}
            {paymentMethod === 'ESCROW_WALLET' && (
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-blue-300 font-medium">Available Account Balance:</span>
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(currentUser?.balance || 0)}
                  </span>
                </div>
                {(currentUser?.balance || 0) < amount ? (
                  <p className="text-rose-400 text-[11px]">
                    Insufficient balance to fund this milestone. Switch to Credit Card or deposit funds.
                  </p>
                ) : (
                  <p className="text-slate-400 text-[11px]">
                    Funds will be deducted from your available balance and locked into sovereign escrow.
                  </p>
                )}
              </div>
            )}

            {/* Security Guarantee Notice */}
            <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Encrypted with 256-bit AES. Funds released ONLY upon your explicit approval.
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isProcessing || (paymentMethod === 'ESCROW_WALLET' && (currentUser?.balance || 0) < amount)}
              className="w-full py-3 rounded-xl text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 transition flex items-center justify-center gap-2 shadow-sm font-mono"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>{processingStep}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Deposit {formatCurrency(amount)} into Escrow</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};