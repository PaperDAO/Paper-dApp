import styled from 'styled-components'

const mainColor = "#cacbcc";

export const SubText = styled.div`
  color: ${mainColor};
  font-size: 20px;
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