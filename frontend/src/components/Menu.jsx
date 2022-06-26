import styled from "styled-components";
import { IoReloadCircle, IoInformationCircle, IoSettings } from "react-icons/io5"
import { GiPodium } from "react-icons/gi"

const Menu = () => {
    
    const MenuContainer = styled.nav`
        display: flex;
        flex-direction: column;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 2;
        align-items: center;
        margin-right: 0.5em;
        margin-bottom: 2.5em;
        font-size: 0.8rem;

        @media screen and (min-width: 320px){
            font-size: 1em;
        }
    `

    return ( 
        <MenuContainer>
            <IoReloadCircle style={{color: "orange", fontSize: "5em", marginBottom: "0.2em"}}/>
            <IoInformationCircle style={{fontSize: "2em"}}/>
            <GiPodium style={{fontSize: "2em"}}/>
            <IoSettings style={{fontSize: "1.8em", marginTop: "0.4em"}}/>
        </MenuContainer>
     );
}
 
export default Menu;