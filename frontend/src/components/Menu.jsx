import styled from "styled-components";
import { IoReloadCircle, IoInformationCircle, IoSettings, IoArrowForwardCircle } from "react-icons/io5"
import { GiPodium } from "react-icons/gi"

const Menu = (props) => {

    const handleStats = () => {
        props.setMenuOpen(true)
        props.setToggleStats(true)
    }
    
    const MenuContainer = styled.nav`
        display: flex;
        flex-direction: column;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 3;
        align-items: center;
        margin-right: 0.5em;
        margin-bottom: 2.5em;
        font-size: 0.8rem;

        @media screen and (min-width: 320px){
            font-size: 1em;
        }

        ${props.menuOpen ? "display: none;" : ""}

        & svg{
            cursor: pointer;
            margin-bottom: 5px;
            transition: all 0.3s;
            -webkit-tap-highlight-color: transparent;
            
            :hover{
                scale: 1.1;
            }
            :active{
                scale: 0.9;
                color: grey !important;
            }
        }

    `

    return ( 
        <MenuContainer>

            {(!props.pWon) ? <IoReloadCircle onClick={props.reload} style={{color: "orange", fontSize: "5em", marginBottom: "0.2em"}}/> : <IoArrowForwardCircle className="scale-in-center" onClick={props.reload} style={{color: "orange", fontSize: "5em", marginBottom: "0.2em"}}/>}
            <IoInformationCircle onClick={handleStats} style={{fontSize: "2em"}}/>
            <GiPodium style={{fontSize: "2em"}}/>
            <IoSettings style={{fontSize: "1.8em", marginTop: "0.4em"}}/>
        </MenuContainer>
     );
}
 
export default Menu;