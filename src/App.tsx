import React, { useState, useEffect, useMemo } from "react";
import {
  AlertCircle,
  ShoppingCart,
  Package,
  Info,
  ChevronLeft,
} from "lucide-react";

const App = () => {
  // UPDATED CONFIGURATION CONSTANTS
  const STOCK_TOTAL_PCS = 250; // Increased stock to accommodate 100pcs CTN
  const CONVERSION = {
    CTN: 100, // Updated: 1 CTN = 100 PCS
    BOX: 10, // Updated: 1 BOX = 10 PCS
    PCS: 1,
  };

  const [quantities, setQuantities] = useState({ CTN: 0, BOX: 0, PCS: 0 });
  const [errorMsg, setErrorMsg] = useState("");
  const [isStrict, setIsStrict] = useState(true);

  // Derived Values
  const currentTotalPcs = useMemo(() => {
    return (
      quantities.CTN * CONVERSION.CTN +
      quantities.BOX * CONVERSION.BOX +
      quantities.PCS * CONVERSION.PCS
    );
  }, [quantities]);

  const remainingPcs = STOCK_TOTAL_PCS - currentTotalPcs;

  const handleUpdate = (uom, value) => {
    const numericValue = Math.max(0, parseInt(value) || 0);

    // Calculate total if this change were applied
    const otherPcs = Object.keys(quantities)
      .filter((k) => k !== uom)
      .reduce((acc, k) => acc + quantities[k] * CONVERSION[k], 0);

    const requestedPcsForThisUom = numericValue * CONVERSION[uom];
    const newTotal = otherPcs + requestedPcsForThisUom;

    if (isStrict && newTotal > STOCK_TOTAL_PCS) {
      // Logic: Auto-set to max possible for this specific field
      const availableForThisUom = Math.floor(
        (STOCK_TOTAL_PCS - otherPcs) / CONVERSION[uom]
      );
      setQuantities((prev) => ({ ...prev, [uom]: availableForThisUom }));
      setErrorMsg("Maaf, pesanan melebihi stok yang tersedia saat ini.");

      // Clear error after 3s
      setTimeout(() => setErrorMsg(""), 3000);
    } else {
      setQuantities((prev) => ({ ...prev, [uom]: numericValue }));
      setErrorMsg("");
    }
  };

  const adjust = (uom, delta) => {
    handleUpdate(uom, quantities[uom] + delta);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="p-4 flex items-center border-b">
          <ChevronLeft className="text-gray-600 mr-2" />
          <div className="flex-1">
            <h1 className="font-bold text-lg text-slate-800">Detail Produk</h1>
          </div>
        </div>

        {/* Product Card */}
        <div className="p-4">
          <div className="bg-white border rounded-2xl p-4 flex gap-4 shadow-sm">
            <div className="w-20 h-20 bg-pink-50 rounded-lg flex items-center justify-center border border-pink-100">
              <Package size={40} className="text-pink-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                ARC-300330
              </p>
              <h2 className="font-bold text-slate-800 text-lg">
                Goguma Hype 50g GT
              </h2>
              <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                Tersedia
              </span>
            </div>
          </div>
        </div>

        {/* Mode Toggle Banner */}
        <div className="px-4 mb-2 flex items-center justify-between bg-slate-900 py-3 mx-4 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isStrict ? "bg-red-500 animate-pulse" : "bg-green-500"
              }`}
            />
            <span className="text-xs font-bold text-white tracking-wide">
              {isStrict ? "STRICT VALIDATION ON" : "BYPASS MODE ACTIVE"}
            </span>
          </div>
          <button
            onClick={() => setIsStrict(!isStrict)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              isStrict ? "bg-blue-500" : "bg-gray-600"
            }`}
          >
            <div
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                isStrict ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        <div className="px-5 mt-6 mb-2 flex justify-between items-end">
          <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
            Pilih Jumlah Pesanan
          </p>
          <p className="text-[10px] text-gray-400 font-medium">
            TOTAL STOK: {STOCK_TOTAL_PCS} PCS
          </p>
        </div>

        {/* UOM Inputs */}
        <div className="px-4 pb-4 space-y-4">
          {["CTN", "BOX", "PCS"].map((uom) => {
            const maxForUom = Math.floor(remainingPcs / CONVERSION[uom]);
            const price = uom === "PCS" ? 500 : uom === "BOX" ? 5000 : 50000;

            return (
              <div
                key={uom}
                className={`transition-all duration-300 p-3 rounded-2xl border ${
                  errorMsg && quantities[uom] > 0
                    ? "bg-red-50 border-red-200"
                    : "bg-white border-gray-100 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-extrabold text-slate-800 text-base">
                      {uom}
                    </p>
                    <p className="text-[11px] font-semibold text-gray-400">
                      Rp {price.toLocaleString()}/{uom}
                    </p>
                    <div className="mt-1 inline-flex items-center text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                      Stok: {Math.floor(STOCK_TOTAL_PCS / CONVERSION[uom])}{" "}
                      {uom}
                      {isStrict && (
                        <span className="mx-1 text-gray-300">|</span>
                      )}
                      {isStrict && (
                        <span className="text-blue-600 font-bold">
                          Sisa: {Math.floor(remainingPcs / CONVERSION[uom])}{" "}
                          {uom}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                    <button
                      onClick={() => adjust(uom, -1)}
                      className="w-10 h-10 flex items-center justify-center text-blue-600 font-black text-xl hover:bg-gray-50 rounded-lg active:scale-90 transition-transform"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantities[uom]}
                      onChange={(e) => handleUpdate(uom, e.target.value)}
                      className="w-12 text-center bg-transparent font-extrabold text-slate-800 outline-none text-lg"
                    />
                    <button
                      onClick={() => adjust(uom, 1)}
                      disabled={isStrict && maxForUom <= 0}
                      className={`w-10 h-10 flex items-center justify-center font-black text-xl rounded-lg transition-all ${
                        isStrict && maxForUom <= 0
                          ? "text-gray-200 bg-gray-50"
                          : "text-blue-600 hover:bg-gray-50 active:scale-90"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {errorMsg && uom === "PCS" && (
                  <div className="mt-3 flex items-start gap-2 text-red-600 bg-white p-2 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] font-bold leading-tight">
                      {errorMsg}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="p-6 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Total Harga
              </p>
              <p className="text-2xl font-black text-slate-800 leading-none">
                Rp
                {(
                  quantities.CTN * 50000 +
                  quantities.BOX * 5000 +
                  quantities.PCS * 500
                ).toLocaleString()}
              </p>
              <p className="text-[9px] text-gray-400 font-medium mt-1">
                *Harga belum termasuk diskon/promo
              </p>
            </div>
            <button
              disabled={currentTotalPcs === 0}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 ${
                currentTotalPcs === 0
                  ? "bg-gray-100 text-gray-400"
                  : "bg-sky-500 text-white shadow-lg shadow-sky-200 active:scale-95"
              }`}
            >
              <ShoppingCart size={18} fill="currentColor" />
              Keranjang
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 max-w-sm bg-white p-4 rounded-2xl border border-dashed border-gray-300">
        <h3 className="text-xs font-black text-slate-800 mb-2 uppercase tracking-widest">
          Logic Update:
        </h3>
        <ul className="text-[10px] text-gray-600 space-y-2 font-medium">
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold">1.</span> 1 CTN = 100 PCS
            | 1 BOX = 10 PCS
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold">2.</span> Total Stock
            awal: 250 PCS (cukup untuk 2 CTN + 5 BOX).
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold">3.</span> Jika anda
            mengisi 2 CTN, BOX maksimal tinggal 5.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default App;
