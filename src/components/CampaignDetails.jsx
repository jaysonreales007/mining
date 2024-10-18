import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import campaignData from '../data.json';

function CampaignDetails() {
  const { campaignId } = useParams();
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0);

  const campaign = campaignData.campaigns.find(c => c.id === parseInt(campaignId));

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  // Assume each campaign has a list of quests
  const currentQuest = campaign.quests[currentQuestIndex];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/quests" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">&larr; Back to Campaigns</Link>
      <h2 className="text-2xl font-bold mb-4">{campaign.title}</h2>
      <p className="text-gray-600 mb-6">{campaign.description}</p>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">Quest {currentQuestIndex + 1}: {currentQuest.title}</h3>
        <p className="text-gray-600 mb-4">{currentQuest.description}</p>
        <p className="text-sm text-gray-500 mb-2">Reward: {currentQuest.reward}</p>
        
        {/* Add quest completion logic here */}
      </div>

      <div className="flex justify-between">
        <button 
          onClick={() => setCurrentQuestIndex(prev => Math.max(0, prev - 1))} 
          disabled={currentQuestIndex === 0}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous Quest
        </button>
        <button 
          onClick={() => setCurrentQuestIndex(prev => Math.min(campaign.quests.length - 1, prev + 1))} 
          disabled={currentQuestIndex === campaign.quests.length - 1}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next Quest
        </button>
      </div>
    </div>
  );
}

export default CampaignDetails;
