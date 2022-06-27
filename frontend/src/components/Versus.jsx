import { useState, useEffect } from 'react';
import styled from "styled-components"
import Menu from './Menu';
import playersFile from "../players.json"

const Versus = () => {

    const [player1, setPlayer1] = useState({})
    const [player2, setPlayer2] = useState({})
    const [reload, setReload] = useState(false)

    const playerArray = playersFile.playersArray
    
    useEffect(() => {
    
        // set random player
        const randomInt1 = Math.floor(Math.random() * playerArray.length)
        const randomInt2 = Math.floor(Math.random() * playerArray.length)
        setPlayer1(playerArray[randomInt1])
        setPlayer2(playerArray[randomInt2])
        
        
    }, [reload, playerArray])
    
    let formatted = ""

    formatted = `#${player1.jersey} | ${player1.pos} | ${player1.heightFeet}"${player1.heightInches} | ${player1.weightPounds} lbs`
    const stats1 = (formatted)
    formatted = `#${player2.jersey} | ${player2.pos} | ${player2.heightFeet}"${player2.heightInches} | ${player2.weightPounds} lbs`
    const stats2 = (formatted)

    const img1 = (`https://cdn.nba.com/headshots/nba/latest/1040x760/${player1.personId}.png`)
    const img2 = (`https://cdn.nba.com/headshots/nba/latest/1040x760/${player2.personId}.png`)

    const logo1 = (`https://cdn.nba.com/logos/nba/${player1.teamId}/global/L/logo.svg`)
    const logo2 = (`https://cdn.nba.com/logos/nba/${player2.teamId}/global/L/logo.svg`)

    let bg1 = ""
    let bg2 = ""
    switch(player1.teamId){
        case "1610612737":
            bg1 = "#DF393E"
            break
        case "1610612738":
            bg1 = "#096839"
            break
        case "1610612751":
            bg1 = "#000000"
            break
        case "1610612766":
            bg1 = "#065F70"
            break
        case "1610612741":
            bg1 = "#CE1241"
            break
        case "1610612739":
            bg1 = "#591E31"
            break
        case "1610612742":
            bg1 = "#024396"
            break
        case "1610612743":
            bg1 = "#0C1B34"
            break
        case "1610612765":
            bg1 = "#1C428A"
            break
        case "1610612744":
            bg1 = "#065591"
            break
        case "1610612745":
            bg1 = "#CE1241"
            break
        case "1610612754":
            bg1 = "#012D61"
            break
        case "1610612746":
            bg1 = "#9F0E25"
            break
        case "1610612747":
            bg1 = "#552582"
            break
        case "1610612763":
            bg1 = "#5D76A9"
            break
        case "1610612748":
            bg1 = "#98002E"
            break
        case "1610612749":
            bg1 = "#00471B"
            break
        case "1610612750":
            bg1 = "#0D2240"
            break
        case "1610612740":
            bg1 = "#012B5C"
            break
        case "1610612752":
            bg1 = "#156EB6"
            break
        case "1610612760":
            bg1 = "#007AC0"
            break
        case "1610612753":
            bg1 = "#0177BF"
            break
        case "1610612755":
            bg1 = "#1A71B9"
            break
        case "1610612756":
            bg1 = "#1D1260"
            break
        case "1610612757":
            bg1 = "#D9363C"
            break
        case "1610612758":
            bg1 = "#623787"
            break
        case "1610612759":
            bg1 = "#b8b8b8"
            break
        case "1610612761":
            bg1 = "#000000"
            break
        case "1610612762":
            bg1 = "#012B5C"
            break
        case "1610612764":
            bg1 = "#012B5C"
            break
        default:
            bg1 = "#051D2D"
    }
    switch(player2.teamId){
        case "1610612737":
            bg2 = "#DF393E"
            break
        case "1610612738":
            bg2 = "#096839"
            break
        case "1610612751":
            bg2 = "#000000"
            break
        case "1610612766":
            bg2 = "#065F70"
            break
        case "1610612741":
            bg2 = "#CE1241"
            break
        case "1610612739":
            bg2 = "#591E31"
            break
        case "1610612742":
            bg2 = "#024396"
            break
        case "1610612743":
            bg2 = "#0C1B34"
            break
        case "1610612765":
            bg2 = "#1C428A"
            break
        case "1610612744":
            bg2 = "#065591"
            break
        case "1610612745":
            bg2 = "#CE1241"
            break
        case "1610612754":
            bg2 = "#012D61"
            break
        case "1610612746":
            bg2 = "#9F0E25"
            break
        case "1610612747":
            bg2 = "#552582"
            break
        case "1610612763":
            bg2 = "#5D76A9"
            break
        case "1610612748":
            bg2 = "#98002E"
            break
        case "1610612749":
            bg2 = "#00471B"
            break
        case "1610612750":
            bg2 = "#0D2240"
            break
        case "1610612740":
            bg2 = "#012B5C"
            break
        case "1610612752":
            bg2 = "#156EB6"
            break
        case "1610612760":
            bg2 = "#007AC0"
            break
        case "1610612753":
            bg2 = "#0177BF"
            break
        case "1610612755":
            bg2 = "#1A71B9"
            break
        case "1610612756":
            bg2 = "#1D1260"
            break
        case "1610612757":
            bg2 = "#D9363C"
            break
        case "1610612758":
            bg2 = "#623787"
            break
        case "1610612759":
            bg2 = "#b8b8b8"
            break
        case "1610612761":
            bg2 = "#000000"
            break
        case "1610612762":
            bg2 = "#012B5C"
            break
        case "1610612764":
            bg2 = "#012B5C"
            break
        default:
            bg2 = "#051D2D"
    }

    const VersusContainer = styled.main`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: ${window.innerHeight}px;
        transition: all 0.3s;
        
        & #one{
            :hover{
                z-index: 2;
            }
            :active{
                background-image: linear-gradient(${bg1}, ${bg1}, black);
            }
            
        }
        & #two{
            :hover{
                z-index: 2;
            }
            :active{
                background-image: linear-gradient(${bg2}, ${bg2}, black);
            }
            
        }
        & .panel{
            height: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
            
            & img,svg{
                -webkit-touch-callout: none;
                -webkit-tap-highlight-color: transparent;
                -moz-user-select: none;
                -webkit-user-select: none;
                user-select: none;
                -webkit-user-drag: none;
            }

            :hover{
                scale: 1.05;
                transition: scale 0.5s;
            }
            :active{
                scale: 1.1;
                transition: scale 0.3s;
            }

            & .info{
                margin: auto;
                z-index: 1;
                position: relative;
            }
            & .name{
                font-size: 2em;
                font-weight: 700;
            }
            & .stats{
                font-size: 1em;
                font-weight: 400;
            }
            & .logoBG{
                position: absolute;
                left: 50%;
                top: 60%;
                transform: translate(-50%,-50%);
                z-index: 0;
                height: 150%;
                opacity: 10%;
            }
            & .player{
                max-height: 30vh;
                max-width: 100%;
                z-index: 1;
            }
        }
    `
    

    return (
        <>
        <Menu reload={setReload}/>
            <VersusContainer>
                <div id='one' className='panel' style={{backgroundColor: bg1}}>
                    <div className='info'>
                        <div>
                            <div className='name'>{player1.firstName} {player1.lastName}</div>
                            <div className='stats'>{stats1}</div>
                        </div>
                    </div>
                    <img className='logoBG' src={logo1} alt="logo1" />
                    <img className='player' src={img1} alt="player1" />
                </div>
                <div id='two' className='panel' style={{backgroundColor: bg2}}>
                    <div className='info'>
                        <div className='name'>{player2.firstName} {player2.lastName}</div>
                        <div className='stats'>{stats2}</div>
                    </div>
                        <img className='logoBG' src={logo2} alt="logo2" />
                    <img className='player' src={img2} alt="player2" />
                </div>
            </VersusContainer>
        </>
     );
}
 
export default Versus;