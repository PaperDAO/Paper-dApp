import styled from 'styled-components'
import { keyframes } from 'styled-components'

const breatheAnimation = keyframes`
 0% { height: 50px; width: 400px; }
 30% { height: 70px; width: 450px; opacity: 1 }
 40% { height: 60px; width: 505px; opacity: 0.3; }
 100% { height: 70px; width: 390px; opacity: 0.6; }
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
`
export const SubText = styled.div`
  color: ${mainColor};
  font-size: 20px;
  font-weight: 700;
  text-align: center;
`

export const Text = styled.div`
  color: ${mainColor};
  font-size: 40px;
  text-align: center;
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
