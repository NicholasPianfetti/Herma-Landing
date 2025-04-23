// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './Footer.css';

// const Footer = () => {
//   const currentYear = new Date().getFullYear();
//   const navigate = useNavigate();
  
//   // Function to handle navigation and scroll to top
//   const handleNavigation = (path, e) => {
//     e.preventDefault();
    
//     // Navigate to the page
//     navigate(path);
    
//     // Scroll to top
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth'
//     });
//   };
  
//   return (
//     <footer className="footer">
//       <div className="container footer-content">
//         <div className="footer-links">
//           <a 
//             href="/privacy-policy" 
//             className="footer-link" 
//             onClick={(e) => handleNavigation('/privacy-policy', e)}
//           >
//             License
//           </a>
//           <a 
//             href="/terms-of-service" 
//             className="footer-link" 
//             onClick={(e) => handleNavigation('/terms-of-service', e)}
//           >
//             Terms of Service
//           </a>
//           <a 
//             href="/attributions" 
//             className="footer-link" 
//             onClick={(e) => handleNavigation('/attributions', e)}
//           >
//             Attributions
//           </a>
//         </div>
//         <div className="copyright">
//         <span className='email'>Contact Us: hermalocal@gmail.com</span>
//           &copy; {currentYear} Herma. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  // Function to handle navigation and scroll to top
  const handleNavigation = (path, e) => {
    e.preventDefault();
    
    // Navigate to the page
    navigate(path);
    
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="bg-[var(--highlight-color)] text-white p-[var(--margin-s)] shadow-[0px_-1px_2px_var(--primary-bg)] min-h-[75px]">
      <div className="flex flex-col text-center m-0">
        <div className="flex justify-center gap-[var(--margin-l)] md:flex-col md:gap-[var(--margin-s)]">
          <a 
            href="/privacy-policy" 
            className="text-white no-underline transition-opacity duration-200 hover:opacity-80" 
            onClick={(e) => handleNavigation('/privacy-policy', e)}
          >
            License
          </a>
          <a 
            href="/terms-of-service" 
            className="text-white no-underline transition-opacity duration-200 hover:opacity-80" 
            onClick={(e) => handleNavigation('/terms-of-service', e)}
          >
            Terms of Service
          </a>
          <a 
            href="/attributions" 
            className="text-white no-underline transition-opacity duration-200 hover:opacity-80" 
            onClick={(e) => handleNavigation('/attributions', e)}
          >
            Attributions
          </a>
        </div>
        <div className="opacity-70 text-[0.9rem] w-full flex justify-between mt-[var(--margin-s)] md:flex-col md:items-center md:mt-[var(--margin-m)]">
          <span className="mr-10 md:mr-0 md:mb-[var(--margin-xs)]">Contact Us: hermalocal@gmail.com</span>
          &copy; {currentYear} Herma. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;