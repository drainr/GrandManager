import React from 'react';
import { useNavigate } from 'react-router-dom';
import YellowButton from '../YellowButton';

const Return = () => {
  const navigate = useNavigate();
  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
      <div style={{ marginRight: 'auto' }}>
        <YellowButton
          text="Return"
          onClick={() => navigate('/')}
        />
      </div>
    </div>
  );
};

export default Return;
