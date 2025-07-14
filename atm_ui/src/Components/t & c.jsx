import React from "react";

function TandC() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-neutral-900 rounded-xl shadow border border-neutral-800 p-6">
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          Terms and Conditions
        </h2>

        {/* Terms List */}
        <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
          <p>
            <span className="text-white font-medium">Ownership:</span> The idea and the code belong to the creator, Shaik Mohammad Vaseem. Any replication, reverse-engineering, or unauthorized commercial use is strictly prohibited.
          </p>
          <p>
            <span className="text-white font-medium">Usage Rules:</span> Users must use this app responsibly and only for its intended purposes. Misuse for fraud or unauthorized activity is prohibited.
          </p>
          <p>
            <span className="text-white font-medium">Liability Disclaimer:</span> This app is provided "as is" without warranties. The creator is not liable for losses or fraudulent activities committed by users.
          </p>
          <p>
            <span className="text-white font-medium">Privacy Policy:</span> Personal data is used only for functionality. No third-party sharing.
          </p>
          <p>
            <span className="text-white font-medium">Modification of Terms:</span> Terms may be updated. Continued use means acceptance of changes.
          </p>
          <p>
            <span className="text-white font-medium">Governing Law:</span> These terms follow Indian law. Disputes are resolved accordingly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TandC;
