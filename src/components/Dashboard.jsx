import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Welcome!</h2>
      <p className="mb-8">To begin your journey with full feature access, please log in to the app. 🚀</p>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8" role="alert">
        <p className="font-bold">📢 New: Quest System</p>
        <p>Complete quests by finishing lessons and quizzes to earn $MOXIE tokens!</p>
        <Link to="/quests" className="font-bold underline">View Quests</Link>
      </div>

      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-8" role="alert">
        <p className="font-bold">Sep 20, 2024</p>
        <p>The Arbitrum Builders Bounty Challenge is LIVE! 🚨</p>
        <p>Everyone is welcome to join! Build and showcase your dApp on Arbitrum's Layer 2 and compete for a share of the $10,000 grant pool.</p>
        <p>Get started <Link to="/campaigns/arbitrum-challenge" className="font-bold underline">here</Link>! 🚀</p>
      </div>

      <h3 className="text-2xl font-bold mb-4">Featured Quests</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-xl font-semibold mb-2">Blockchain Basics Quest</h4>
          <p className="text-gray-600 mb-4">Complete the first lesson in the Blockchain Basics course.</p>
          <Link 
            to="/courses/1"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Start Quest
          </Link>
        </div>
        {/* Add more featured quests as needed */}
      </div>
    </div>
  );
}

export default Dashboard;
