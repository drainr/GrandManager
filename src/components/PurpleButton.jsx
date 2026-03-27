import React from 'react';
import styled from 'styled-components';

const PurpleButton = ({text, onClick}) => {
    return (
        <StyledWrapper>
            <button onClick={onClick}>{text}</button>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
    
 
  button {
      --green: #3FB348;
      --darkGreen: #2C8A3A;
      --lightBlue: #3FB3E2;
      --darkBlue: #364A85;
      --mediumBlue: #445AE2;
      --brightYellow: #F1CD15;
      --darkRed: #AA282A;
      --lightRed: #C22B32;
    font-size: clamp(0.8rem, 1.5vw, 1rem);
    background-color: #9262D2;
    color: white;
    text-shadow: 0 2px 0 #4d2c72;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 0;
    z-index: 1;
    user-select: none;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    white-space: nowrap;
    padding: clamp(0.5rem, 1.2vw, 0.8rem) clamp(0.75rem, 2.2vw, 1.25rem);
    text-decoration: none;
    font-weight: 900;
    max-width: 100%;
    box-sizing: border-box;
    transition: all 0.7s cubic-bezier(0,.8,.26,.99);
  }

  button:before {
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    content: '';
    transition: .7s cubic-bezier(0,.8,.26,.99);
    z-index: -1;
    background-color: #9262D2;
    box-shadow: 0 -4px rgb(0 0 0 / 40%) inset, 0 4px rgb(255 255 255 / 10%) inset, -4px 0 rgb(255 255 255 / 10%) inset, 4px 0 rgb(0 0 0 / 40%) inset;
  }

  button:before {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  content: '';
  transition: .7s cubic-bezier(0,.8,.26,.99);
  z-index: -1;

  background-color: #4d2c72;

  box-shadow:
    0 -4px rgba(0,0,0,0.4) inset,
    0 4px rgba(255,255,255,0.2) inset,
    -4px 0 rgba(255,255,255,0.2) inset,
    4px 0 rgba(0,0,0,0.4) inset;
}

button:after {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  content: '';

  box-shadow: 0 4px 0 0 #4d2c72;
  transition: .7s cubic-bezier(0,.8,.26,.99);
}

button:hover:before {
  box-shadow:
    0 -4px rgba(0,0,0,0.4) inset,
    0 4px rgba(255,255,255,0.2) inset,
    -4px 0 rgba(255,255,255,0.2) inset,
    4px 0 rgba(0,0,0,0.4) inset;
}

button:hover:after {
  box-shadow: 0 4px 0 0 #4d2c72;
}

button:active {
  transform: translateY(4px);
}

button:active:after {
  box-shadow: 0 0 0 0 #4d2c72;
}`;

export default PurpleButton;
