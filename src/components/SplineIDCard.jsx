import React from 'react';

const SplineIDCard = ({ className = "" }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <iframe
        src="https://my.spline.design/sleekidbadge-dkLns1OJC7vtgG2QbFbORXbI/"
        frameBorder="0"
        width="100%"
        height="100%"
        style={{
          minHeight: '500px',
          borderRadius: '16px',
          filter: 'drop-shadow(0 0 20px rgba(78, 132, 238, 0.3))',
        }}
        title="Sleek ID Badge 3D Model"
        loading="lazy"
      />
    </div>
  );
};

export default SplineIDCard;
