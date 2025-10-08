'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';

interface FormData {
  step: string;
  type: string;
  amount: string;
  oldbalanceOrg: string;
  newbalanceOrg: string;
  oldbalanceDest: string;
  newbalanceDest: string;
}

interface PredictionResponse {
  fraudProbability: number;  // float value between 0 and 1
  fraud: boolean;
}

export default function FraudDetectDashboard() {
  const [formData, setFormData] = useState<FormData>({
    step: '',
    type: 'PAYMENT',
    amount: '',
    oldbalanceOrg: '',
    newbalanceOrg: '',
    oldbalanceDest: '',
    newbalanceDest: '',
  });

  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<PredictionResponse>(
        'http://localhost:8080/api/predict',
        {
          step: Number(formData.step),
          type: formData.type,
          amount: Number(formData.amount),
          oldbalanceOrg: Number(formData.oldbalanceOrg),
          newbalanceOrg: Number(formData.newbalanceOrg),
          oldbalanceDest: Number(formData.oldbalanceDest),
          newbalanceDest: Number(formData.newbalanceDest),
        }
      );

      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze transaction');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fraudProbability = result?.fraudProbability ?? 0;
  const isFraud = result?.fraud ?? fraudProbability > 0.5;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-[#101c22]">
      <div className="w-full max-w-md mx-auto">
        <header className="flex items-center justify-between py-6">
          <h1 className="text-xl font-bold text-black dark:text-white">FraudDetect.AI</h1>
          <button className="text-black dark:text-white">
            <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM215.9,155.55a91.32,91.32,0,0,1-6.23,15l-22.58-2.51a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.57,91.57,0,0,1-15,6.23L141.4,193.05a8,8,0,0,0-5.48-1.74,73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74l-17.73,14.19a91.32,91.32,0,0,1-15-6.23l-2.51-22.58a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64l-22.58,2.51a91.57,91.57,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.32,91.32,0,0,1,6.23-15l22.58,2.51a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14,8,8,0,0,0,2.64-5.1L85.4,46.43a91.57,91.57,0,0,1,15-6.23l17.73,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74l17.73-14.19a91.32,91.32,0,0,1,15,6.23l2.51,22.58a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58-2.51a91.57,91.57,0,0,1,6.23,15l-14.19,17.73a8,8,0,0,0-1.74,5.48,73.93,73.93,0,0,1,0,8.68A8,8,0,0,0,201.71,137.82Z"></path>
            </svg>
          </button>
        </header>

        <main className="backdrop-blur-lg bg-white/10 dark:bg-[#101c22]/50 border border-white/20 dark:border-white/10 rounded-xl p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2" htmlFor="step">
                  Step
                </label>
                <input
                  className="w-full bg-black/20 dark:bg-white/5 border-none rounded px-4 py-2 focus:ring-2 focus:ring-[#13a4ec] text-black dark:text-white placeholder-gray-500"
                  id="step"
                  name="step"
                  placeholder="1"
                  type="number"
                  value={formData.step}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2" htmlFor="type">
                  Type
                </label>
                <select
                  className="w-full bg-black/20 dark:bg-white/5 border-none rounded px-4 py-2 focus:ring-2 focus:ring-[#13a4ec] text-black dark:text-white"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option className='text-black' >PAYMENT</option>
                  <option className='text-black' >TRANSFER</option>
                  <option className='text-black' >CASH_OUT</option>
                  <option className='text-black' >DEBIT</option>
                  <option className='text-black' >CASH_IN</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2" htmlFor="amount">
                Amount
              </label>
              <input
                className="w-full bg-black/20 dark:bg-white/5 border-none rounded px-4 py-2 focus:ring-2 focus:ring-[#13a4ec] text-black dark:text-white placeholder-gray-500"
                id="amount"
                name="amount"
                placeholder="9839.64"
                type="text"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2" htmlFor="oldbalanceOrg">
                  Old Balance (Origin)
                </label>
                <input
                  className="w-full bg-black/20 dark:bg-white/5 border-none rounded px-4 py-2 focus:ring-2 focus:ring-[#13a4ec] text-black dark:text-white placeholder-gray-500"
                  id="oldbalanceOrg"
                  name="oldbalanceOrg"
                  placeholder="170136.0"
                  type="text"
                  value={formData.oldbalanceOrg}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2" htmlFor="newbalanceOrg">
                  New Balance (Origin)
                </label>
                <input
                  className="w-full bg-black/20 dark:bg-white/5 border-none rounded px-4 py-2 focus:ring-2 focus:ring-[#13a4ec] text-black dark:text-white placeholder-gray-500"
                  id="newbalanceOrg"
                  name="newbalanceOrg"
                  placeholder="160296.36"
                  type="text"
                  value={formData.newbalanceOrg}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2" htmlFor="oldbalanceDest">
                  Old Balance (Dest)
                </label>
                <input
                  className="w-full bg-black/20 dark:bg-white/5 border-none rounded px-4 py-2 focus:ring-2 focus:ring-[#13a4ec] text-black dark:text-white placeholder-gray-500"
                  id="oldbalanceDest"
                  name="oldbalanceDest"
                  placeholder="0.0"
                  type="text"
                  value={formData.oldbalanceDest}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2" htmlFor="newbalanceDest">
                  New Balance (Dest)
                </label>
                <input
                  className="w-full bg-black/20 dark:bg-white/5 border-none rounded px-4 py-2 focus:ring-2 focus:ring-[#13a4ec] text-black dark:text-white placeholder-gray-500"
                  id="newbalanceDest"
                  name="newbalanceDest"
                  placeholder="0.0"
                  type="text"
                  value={formData.newbalanceDest}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              className="w-full bg-[#13a4ec] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#13a4ec]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Transaction'}
            </button>
          </form>

          {error && (
            <div className="text-center text-red-400 text-sm bg-red-500/20 p-3 rounded">
              {error}
            </div>
          )}

          {result && (
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-black dark:text-white">Result</h3>
                <span className="text-2xl font-bold text-[#13a4ec]">
                  {Math.round(fraudProbability * 100)}%
                </span>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#13a4ec]/20">
                  <div
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#13a4ec] transition-all duration-500"
                    style={{ width: `${fraudProbability * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <span
                  className={`inline-block ${isFraud
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-green-500/20 text-green-400'
                    } text-sm font-semibold px-4 py-2 rounded-full`}
                >
                  {isFraud ? 'Likely Fraud 🚨' : 'Legitimate Transaction ✅'}
                </span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}