import styled from 'styled-components'
import { keyframes } from 'styled-components'

const breatheAnimation = keyframes`
 0% { height: 45px; width: 410px; }
 30% { height: 40px; width: 450px; opacity: 1 }
 40% { height: 50px; width: 545px; opacity: 0.3; }
 100% { height: 35px; width: 390px; opacity: 0.6; }
`
const mainColor = "#cacbcc";

const mintLikAnim = keyframes`
  0% { opacity: 0.9 }
  30% { opacity: 1 }
  40% { opacity: 0.6; }
  100% { opacity: 0.8; }
`
export const LinkText = styled.div`
  color: #66aed6;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  &:hover {
    color: lightblue;
  }
  animation-name: ${mintLikAnim};
  animation-duration: 8s;
  animation-iteration-count: infinite;
`

export const MintStatusText = styled.div`
  color: #66aed6;
  font-size: 18px;
  animation-name: ${breatheAnimation};
  animation-duration: 8s;
  animation-iteration-count: infinite;
  margin-top: 10px;
`
export const SubText = styled.div`
  color: ${mainColor};
  font-size: 20px;
  font-weight: 700;
  text-align: center;
`
export const SubTextLf = styled.div`
  color: ${mainColor};
  font-size: 20px;
  font-weight: 700;
  text-align: left;
`
export const SubTextLfSm = styled.div`
  color: ${mainColor};
  font-size: 16px;
  font-weight: 600;
  text-align: left;
`
export const ErrorText = styled.div`
  color: white;
  font-size: 18px;
  background-color: #f5d0f3;
  padding: 4px 6px;
`
export const Text = styled.div`
  color: ${mainColor};
  font-size: 40px;
  text-align: center;
  margin: 0;
`
export const Header = styled.div`
  color: ${mainColor};
  font-size: 70px;
  font-weight: 700;
  text-align: center;
`

export const MintedText = styled(Text)`
  margin-top: 20px;
`
