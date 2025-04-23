// // FeatureCard.jsx
// import React from 'react';
// import './FeatureCard.css';

// const FeatureCard = ({ icon, title, description }) => {
//   return (
//     <div className="feature">
//       <div className="feature-icon">
//         {icon}
//       </div>
//       <h3>{title}</h3>
//       <p>{description}</p>
//     </div>
//   );
// };

// export default FeatureCard;

import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-[var(--primary-bg)] p-[var(--margin-l)] rounded-[var(--radius-lg)] text-center shadow-[var(--shadow-md)] transition-all duration-300 hover:translate-y-[-5px] hover:shadow-[var(--shadow-lg)] w-full h-full">
      <div className="flex justify-center items-center mb-[var(--margin-s)] text-[var(--highlight-color)]">
        {icon}
      </div>
      <h3 className="text-[var(--h4-size)] mb-[var(--margin-s)] text-[var(--highlight-color)]">
        {title}
      </h3>
      <p className="opacity-90">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;