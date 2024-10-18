import React from 'react';
import { Link } from 'react-router-dom';
import campaignData from '../data.json';

function Campaigns() {
  const { campaigns } = campaignData;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">{campaign.title}</h3>
            <p className="text-gray-600 mb-4">{campaign.description}</p>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Reward Pool: {campaign.rewardPool}</p>
              <p className="text-sm text-gray-500">Quests: {campaign.quests}</p>
              <p className="text-sm text-gray-500">Start: {campaign.startDate}</p>
              <p className="text-sm text-gray-500">End: {campaign.endDate}</p>
            </div>
            <Link 
              to={`/campaigns/${campaign.id}`}
              className="w-full bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700 transition duration-300 inline-block text-center"
            >
              View Campaign
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Campaigns;
