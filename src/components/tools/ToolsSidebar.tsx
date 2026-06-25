"use client";

import React, { useState, useEffect } from "react";
import { X, Calculator, Percent, ShieldCheck, HelpCircle } from "lucide-react";

export default function ToolsSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"mortgage" | "roi">("mortgage");

  // Mortgage Calculator State
  const [propertyPrice, setPropertyPrice] = useState(2500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTermYears, setLoanTermYears] = useState(25);

  // ROI Calculator State
  const [purchasePrice, setPurchasePrice] = useState(2500000);
  const [annualRent, setAnnualRent] = useState(180000);
  const [serviceCharges, setServiceCharges] = useState(15000);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-tools-sidebar", handleOpen);
    return () => {
      window.removeEventListener("open-tools-sidebar", handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Mortgage Calculations
  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = propertyPrice - downPaymentAmount;
  const monthlyRate = interestRate / 12 / 100;
  const totalPayments = loanTermYears * 12;

  let monthlyInstallment = 0;
  if (interestRate > 0) {
    monthlyInstallment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
  } else {
    monthlyInstallment = loanAmount / totalPayments;
  }

  if (isNaN(monthlyInstallment) || !isFinite(monthlyInstallment)) {
    monthlyInstallment = 0;
  }

  const totalPayable = monthlyInstallment * totalPayments;
  const totalInterest = Math.max(0, totalPayable - loanAmount);

  // ROI Calculations
  const grossYield = purchasePrice > 0 ? (annualRent / purchasePrice) * 100 : 0;
  const netRent = annualRent - serviceCharges;
  const netYield = purchasePrice > 0 ? (netRent / purchasePrice) * 100 : 0;

  // Format AED Helper
  const formatAED = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl z-[110] flex flex-col font-sans animate-in slide-in-from-right duration-350 rounded-none text-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Real Estate Financial Tools
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab("mortgage")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
              activeTab === "mortgage"
                ? "border-primary text-primary bg-white"
                : "border-transparent text-slate-400 hover:text-slate-650 bg-slate-50/50"
            }`}
          >
            Mortgage Calculator
          </button>
          <button
            onClick={() => setActiveTab("roi")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
              activeTab === "roi"
                ? "border-primary text-primary bg-white"
                : "border-transparent text-slate-400 hover:text-slate-650 bg-slate-50/50"
            }`}
          >
            ROI & Rental Yield
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "mortgage" ? (
            /* Mortgage Calculator View */
            <div className="space-y-6">
              <div className="bg-slate-55 border border-slate-200 p-4 rounded-none space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Estimated Monthly Installment
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-mono">
                  {formatAED(monthlyInstallment)}
                  <span className="text-xs font-bold text-slate-500 font-sans tracking-normal lowercase">
                    {" "}
                    / month
                  </span>
                </div>
              </div>

              {/* Slider / Input Group: Property Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700 uppercase tracking-wide">
                    Property Value
                  </label>
                  <span className="font-mono font-bold text-primary">
                    {formatAED(propertyPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="15000000"
                  step="100000"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 appearance-none cursor-pointer accent-primary"
                />
                <input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full text-xs font-mono border border-slate-200 p-2.5 rounded-none focus:outline-none focus:border-primary"
                />
              </div>

              {/* Slider / Input Group: Down Payment Percent */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700 uppercase tracking-wide">
                    Down Payment
                  </label>
                  <span className="font-mono font-bold text-primary">
                    {downPaymentPercent}% ({formatAED(downPaymentAmount)})
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 appearance-none cursor-pointer accent-primary"
                />
                <div className="flex gap-2">
                  {[10, 20, 30, 40].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setDownPaymentPercent(pct)}
                      className={`flex-1 py-1.5 text-[10px] font-bold border transition rounded-none ${
                        downPaymentPercent === pct
                          ? "bg-primary text-white border-primary"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Interest & Term */}
              <div className="grid grid-cols-2 gap-4">
                {/* Interest Rate */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="15"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full text-xs font-mono border border-slate-200 p-2.5 rounded-none focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Loan Term */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Loan Term (Years)
                  </label>
                  <select
                    value={loanTermYears}
                    onChange={(e) => setLoanTermYears(Number(e.target.value))}
                    className="w-full text-xs font-semibold border border-slate-200 p-2.5 rounded-none focus:outline-none focus:border-primary bg-white h-[38px]"
                  >
                    {[5, 10, 15, 20, 25, 30].map((y) => (
                      <option key={y} value={y}>
                        {y} Years
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Loan Calculation Summary
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                    <span className="text-slate-500">Principal Loan Amount</span>
                    <span className="font-semibold font-mono">{formatAED(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                    <span className="text-slate-500">Total Interest Payable</span>
                    <span className="font-semibold font-mono">{formatAED(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold">
                    <span className="text-slate-700">Total Amount Payable</span>
                    <span className="font-mono text-slate-900">{formatAED(totalPayable)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ROI & Rental Yield Calculator View */
            <div className="space-y-6">
              {/* Yield Output Cards */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-slate-55 border border-slate-200 p-4 rounded-none space-y-1">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Gross Yield
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-700 font-mono">
                    {grossYield.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-slate-55 border border-slate-200 p-4 rounded-none space-y-1">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Net Yield
                  </div>
                  <div className="text-2xl font-extrabold text-blue-700 font-mono">
                    {netYield.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-5">
                {/* Purchase Price */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-700 uppercase tracking-wide">
                      Purchase Price (AED)
                    </label>
                    <span className="font-mono font-semibold text-slate-500">
                      {formatAED(purchasePrice)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full text-xs font-mono border border-slate-200 p-2.5 rounded-none focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Annual Rent */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-700 uppercase tracking-wide">
                      Estimated Annual Rent (AED)
                    </label>
                    <span className="font-mono font-semibold text-slate-500">
                      {formatAED(annualRent)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={annualRent}
                    onChange={(e) => setAnnualRent(Number(e.target.value))}
                    className="w-full text-xs font-mono border border-slate-200 p-2.5 rounded-none focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Service Charges */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-700 uppercase tracking-wide">
                      Annual Service Charges (AED)
                    </label>
                    <span className="font-mono font-semibold text-slate-500">
                      {formatAED(serviceCharges)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={serviceCharges}
                    onChange={(e) => setServiceCharges(Number(e.target.value))}
                    className="w-full text-xs font-mono border border-slate-200 p-2.5 rounded-none focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Yield Summary */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Rental Return Highlights
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                    <span className="text-slate-500">Gross Rental Yield</span>
                    <span className="font-semibold text-emerald-600">{grossYield.toFixed(2)}% / yr</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                    <span className="text-slate-500">Net Rental Return</span>
                    <span className="font-semibold text-blue-600">{formatAED(netRent)} / yr</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold">
                    <span className="text-slate-700">Net Rental Yield</span>
                    <span className="text-slate-900">{netYield.toFixed(2)}% / yr</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info lock */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
          <span>Secured investor planning sandbox</span>
        </div>
      </div>
    </>
  );
}
