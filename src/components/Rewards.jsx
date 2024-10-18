import { useState } from 'react';

function Rewards() {
  const [balance, setBalance] = useState(100);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Rewards</h2>
      <p className="text-gray-600 mb-6">Complete courses and tasks to earn $MOXIE tokens</p>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Available Balance</h3>
        <p className="text-3xl font-bold text-indigo-600">{balance} $MOXIE</p>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Vesting Schedule</h3>
        <p className="text-gray-600">Tokens are released over time to encourage long-term learning.</p>
      </div>
      <button className="w-full bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition duration-300">
        Claim Rewards
      </button>
    </div>
  );
}

export default Rewards;
