import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-xl text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full h-full border border-blue-100">
      <div className="flex justify-center items-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-[var(--highlight-color)]">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4 text-blue-900">
        {title}
      </h3>
      <p className="text-blue-700">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;