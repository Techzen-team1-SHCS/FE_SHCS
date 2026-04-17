import styled from 'styled-components';

const Button = ({props,onClick}) => {
  return (
    <StyledWrapper>
      <button onClick={onClick}> {props}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
   background-color: #8B4513;
   border-radius: 4px;
   color: #fff;
   cursor: pointer;
   padding: 15px 20px;
   font-size: 18px;
   font-weight: bold;
   letter-spacing: 1px;
   border: none;
  }

  button:hover {
   background-image: linear-gradient(90deg, #53cbef 0%, #dcc66c 50%, #ffa3b6 75%, #53cbef 100%);
   animation: slidernbw 5s linear infinite;
   color: #000;
  }

  @keyframes slidernbw {
   to {
    background-position: 20vw;
   }
  }`;

export default Button;
