import React from "react";

/**
 * Reusable Logo component for DOSO
 * @param {Object} props
 * @param {boolean} props.showText - Whether to show the full name below the logo
 * @param {string} props.className - Additional classes for the container
 * @param {string} props.imgClassName - Additional classes for the image
 * @param {string} props.textClassName - Additional classes for the text
 */
const Logo = ({
  showText = false,
  className = "",
  imgClassName = "w-10 h-10",
  textClassName = "",
}) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <img
        src="/doso_logo.jpeg"
        alt="DOSO Logo"
        className={`object-cover rounded-lg ${imgClassName}`}
      />
      {showText && (
        <span
          className={`text-xs sm:text-sm font-bold text-slate-800 dark:text-white text-center leading-tight tracking-tight uppercase ${textClassName}`}
        >
          Darul Hidaya <br className="sm:hidden" /> Old Students Organization
        </span>
      )}
    </div>
  );
};

export default Logo;
