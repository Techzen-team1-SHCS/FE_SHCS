import React from 'react';
import styled from 'styled-components';

const ButtonCancel = ({ text, color, onClick, disabled }) => {
  // Kiểm tra nếu là button "Hoàn Thành" (màu xanh)
  const isCompletedButton = color === "green" || color === "#10B981" || text === "Hoàn Thành";
  
  return (
    <StyledWrapper isCompleted={isCompletedButton}>
      <button 
        className="noselect" 
        style={{ backgroundColor: color }} 
        onClick={!disabled ? onClick : undefined}
        disabled={disabled}
      >
        <span className="text">{text}</span>
        <span className="icon">
          {isCompletedButton ? (
            // Dấu tick ✓ cho button Hoàn Thành
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" fill="#fff" />
            </svg>
          ) : (
            // Dấu X cho button Hủy Phòng
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" fill="#eee" />
            </svg>
          )}
        </span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    width: 150px;
    height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    background: red;
    border: none;
    border-radius: 5px;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
    background: ${props => props.isCompleted ? '#10B981' : '#e62222'};
  }

  button, button span {
    transition: 200ms;
  }

  button .text {
    margin-left: -20px;
    transform: translateX(35px);
    color: white;
    font-weight: bold;
  }

  button .icon {
    position: absolute;
    border-left: 1px solid #fff;
    transform: translateX(110px);
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button svg {
    width: 15px;
  }

  /* Hiệu ứng hover cho button Hủy Phòng */
  ${props => !props.isCompleted && `
    button:hover {
      background: #ff3636;
    }

    button:hover .text {
      color: transparent;
    }

    button:hover .icon {
      width: 150px;
      border-left: none;
      transform: translateX(0);
    }

    button:active .icon svg {
      transform: scale(0.8);
    }
  `}

  /* Hiệu ứng hover cho button Hoàn Thành */
  ${props => props.isCompleted && `
    button:hover {
      background: #059669;
    }

    button:hover .text {
      color: transparent;
    }

    button:hover .icon {
      width: 150px;
      border-left: none;
      transform: translateX(0);
    }

    button:active .icon svg {
      transform: scale(0.8);
    }
  `}

  button:focus {
    outline: none;
  }
`;

export default ButtonCancel;