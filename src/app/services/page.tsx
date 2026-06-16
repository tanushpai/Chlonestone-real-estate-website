"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building, 
  TrendingUp, 
  ShieldCheck, 
  Calculator, 
  HelpCircle, 
  DollarSign, 
  Sparkles 
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ServicesPage() {
  // Calculator states
  const [activeTab, setActiveTab] = useState<"yield" | "mortgage">("yield");

  // Yield Calculator states
  const [propertyPrice, setPropertyPrice] = useState("2000000");
  const [annualRent, setAnnualRent] = useState("150000");
  const [serviceCharges, setServiceCharges] = useState("15"); // AED per sqft average or percentage
  const [sqft, setSqft] = useState("1000");

  const priceNum = parseFloat(propertyPrice) || 0;
  const rentNum = parseFloat(annualRent) || 0;
  const sqftNum = parseFloat(sqft) || 0;
  const chargeNum = parseFloat(serviceCharges) || 0;

  // Gross Yield = (Rent / Price) * 100
  const grossYield = priceNum > 0 ? (rentNum / priceNum) * 100 : 0;

  // Net Yield = ((Rent - ServiceCharges) / Price) * 100
  const totalCharges = sqftNum * chargeNum;
  const netRent = rentNum - totalCharges;
  const netYield = priceNum > 0 ? (netRent / priceNum) * 100 : 0;

  // Mortgage Calculator states
  const [mortgagePrice, setMortgagePrice] = useState("2000000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [interestRate, setInterestRate] = useState("4.5");
  const [loanTermYears, setLoanTermYears] = useState("25");

  const mPriceNum = parseFloat(mortgagePrice) || 0;
  const mDownPercent = parseFloat(downPaymentPercent) || 0;
  const mRate = parseFloat(interestRate) || 0;
  const mYears = parseFloat(loanTermYears) || 0;

  const mDownPaymentAmount = mPriceNum * (mDownPercent / 100);
  const mLoanAmount = mPriceNum - mDownPaymentAmount;

  const monthlyRate = mRate / 12 / 100;
  const totalPayments = mYears * 12;

  let monthlyPayment = 0;
  if (mLoanAmount > 0 && totalPayments > 0) {
    if (monthlyRate === 0) {
      monthlyPayment = mLoanAmount / totalPayments;
    } else {
      monthlyPayment = mLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    }
  }

  const mTotalPaid = monthlyPayment * totalPayments;
  const mTotalInterest = mTotalPaid - mLoanAmount;

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-16 lg:pt-32 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12 sm:space-y-16">
          
          {/* Header section */}
          <div className="mb-8 max-w-2xl">
            <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl font-heading text-slate-900">
              Tailored Real Estate Services
            </h1>
            <p className="mt-3 text-slate-500 text-sm sm:text-base leading-relaxed">
              From developer off-plan acquisitions to private resale assets and property management, we provide specialized advisory services built on transparency.
            </p>
          </div>

          {/* Core Services Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Service 1 */}
            <div className="p-6 sm:p-8 bg-white border rounded-3xl shadow-sm space-y-4 hover:border-primary/40 transition">
              <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Off-Plan Property Advisory</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Discover Dubai&apos;s latest off-plan developments with expert guidance on payment plans, project locations, developer reputation, and investment potential.
              </p>
            </div>

            {/* Service 2 */}
            <div className="p-6 sm:p-8 bg-white border rounded-3xl shadow-sm space-y-4 hover:border-primary/40 transition">
              <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Investment Advisory</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Identify high-growth investment opportunities across Dubai&apos;s most sought-after communities with insights on rental yields and future appreciation.
              </p>
            </div>

            {/* Service 3 */}
            <div className="p-6 sm:p-8 bg-white border rounded-3xl shadow-sm space-y-4 hover:border-primary/40 transition">
              <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Mortgage Assistance</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Get support in finding suitable mortgage solutions, understanding financing options, and navigating the home-buying process with confidence.
              </p>
            </div>

            {/* Service 4 */}
            <div className="p-6 sm:p-8 bg-white border rounded-3xl shadow-sm space-y-4 hover:border-primary/40 transition">
              <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Property Resale Services</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Buy or sell residential properties with professional market guidance, property valuation support, and seamless transaction assistance.
              </p>
            </div>

          </section>

          {/* Interactive Calculators Widget */}
          <section className="bg-white border rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            
            {/* Tabs Selector */}
            <div className="flex flex-wrap gap-2 border-b pb-4">
              <button
                onClick={() => setActiveTab("yield")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
                  activeTab === "yield"
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Rental Yield Calculator
              </button>
              <button
                onClick={() => setActiveTab("mortgage")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition ${
                  activeTab === "mortgage"
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Mortgage Calculator
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {activeTab === "yield" ? (
                <>
                  {/* Yield Inputs Panel */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold text-slate-900 font-heading">Rental Yield Calculator</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Quickly calculate estimated ROI (Return on Investment) for properties. Enter buying prices and projected rental rates.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-slate-400" /> Property Price (AED)
                        </label>
                        <Input
                          type="number"
                          value={propertyPrice}
                          onChange={(e) => setPropertyPrice(e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-slate-400" /> Annual Rent (AED)
                        </label>
                        <Input
                          type="number"
                          value={annualRent}
                          onChange={(e) => setAnnualRent(e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Property Size (SqFt)</label>
                        <Input
                          type="number"
                          value={sqft}
                          onChange={(e) => setSqft(e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          Service Charge (AED/SqFt) <span title="Estimated maintenance costs per sqft per year."><HelpCircle className="h-3 w-3 text-slate-400" /></span>
                        </label>
                        <Input
                          type="number"
                          value={serviceCharges}
                          onChange={(e) => setServiceCharges(e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Yield Results Display Panel */}
                  <div className="bg-slate-50 border rounded-2xl p-6 flex flex-col justify-between space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Estimated Returns</h4>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        {/* Gross Yield */}
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                          <p className="text-xs text-slate-500 font-semibold">Gross Yield</p>
                          <p className="text-2xl sm:text-3xl font-extrabold text-primary font-heading mt-1">
                            {grossYield.toFixed(2)}%
                          </p>
                          <p className="text-[0.65rem] text-slate-400 mt-0.5">Pre-expense return</p>
                        </div>

                        {/* Net Yield */}
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                          <p className="text-xs text-slate-500 font-semibold">Net Yield</p>
                          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-heading mt-1">
                            {netYield.toFixed(2)}%
                          </p>
                          <p className="text-[0.65rem] text-slate-400 mt-0.5">Post-maintenance return</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats detail */}
                    <div className="border-t pt-4 text-xs text-slate-500 space-y-2">
                      <div className="flex justify-between">
                        <span>Gross Rent Income:</span>
                        <span className="font-semibold text-slate-800">AED {rentNum.toLocaleString()} / year</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Annual Service Charges:</span>
                        <span className="font-semibold text-slate-800">AED {totalCharges.toLocaleString()} / year</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-semibold text-slate-800">
                        <span>Net Rent Income:</span>
                        <span>AED {netRent.toLocaleString()} / year</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Mortgage Inputs Panel */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold text-slate-900 font-heading">Mortgage Calculator</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Calculate your monthly loan payments based on Dubai bank parameters. Central Bank rules typically require a minimum 20% down payment.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-slate-400" /> Property Price (AED)
                        </label>
                        <Input
                          type="number"
                          value={mortgagePrice}
                          onChange={(e) => setMortgagePrice(e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Down Payment (%)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={downPaymentPercent}
                          onChange={(e) => setDownPaymentPercent(e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Interest Rate (%)</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Loan Term (Years)</label>
                        <Input
                          type="number"
                          value={loanTermYears}
                          onChange={(e) => setLoanTermYears(e.target.value)}
                          className="rounded-xl h-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mortgage Results Display Panel */}
                  <div className="bg-slate-50 border rounded-2xl p-6 flex flex-col justify-between space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Monthly Commitment</h4>
                      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center mt-6">
                        <p className="text-xs text-slate-500 font-semibold">Monthly Payment</p>
                        <p className="text-3xl sm:text-4xl font-extrabold text-primary font-heading mt-1 text-[#1E3A8A]">
                          AED {Math.round(monthlyPayment).toLocaleString()}
                        </p>
                        <p className="text-[0.65rem] text-slate-400 mt-1">Principal + Interest instalments</p>
                      </div>
                    </div>

                    {/* Stats detail */}
                    <div className="border-t pt-4 text-xs text-slate-500 space-y-2">
                      <div className="flex justify-between">
                        <span>Down Payment:</span>
                        <span className="font-semibold text-slate-800">AED {Math.round(mDownPaymentAmount).toLocaleString()} ({mDownPercent}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Loan Amount (Principal):</span>
                        <span className="font-semibold text-slate-800">AED {Math.round(mLoanAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Total Interest:</span>
                        <span className="font-semibold text-slate-800">AED {Math.round(mTotalInterest).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-semibold text-slate-800">
                        <span>Total Outlay over {mYears} Years:</span>
                        <span>AED {Math.round(mTotalPaid + mDownPaymentAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </section>

          {/* CTA Footer */}
          <section className="text-center py-6 border-t space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-heading">Secure premium investment advisory today</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our experts can help review developers and source primary launch allocation inventory.
            </p>
            <Link href="tel:+971526238780">
              <Button className="rounded-xl px-6 bg-[#111827] text-white mt-2">Connect with Advisor</Button>
            </Link>
          </section>

        </div>
      </main>
    </>
  );
}
