import React from 'react'
import { NavLink } from 'react-router-dom'
import WhoAmI from './WhoAmI'
import styled from 'styled-components'

const NavBar = () => (
  <Nav>
    <Left>
      <NavElem>
        <StyledNavLink exact to='/'>blogs</StyledNavLink>
      </NavElem>
      <NavElem>
        <StyledNavLink exact to='/users'>users</StyledNavLink>
      </NavElem>
    </Left>
    <Right>
      <Elem>
        <WhoAmI />
      </Elem>
    </Right>
  </Nav>
)

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  font-size: 1rem;
`

const Left = styled.div`
  display: flex;
  font-size: 1.2em;
  padding-left: 3vw;
`

const Right = styled.div`
  padding-right: 3vw;
`

const Elem = styled.div`
  padding: 7px 5px;
  &:first-child {
    padding-left: 0;
  }
`

const NavElem = styled(Elem)`
  &:hover {
    text-decoration: underline;
  }
`

const StyledNavLink = styled(NavLink)`
  color: black;
  text-decoration: none;
  &.active {
    font-weight: bold;
  }
`

export default NavBar
