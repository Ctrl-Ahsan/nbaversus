import { useState, useEffect } from 'react';
import styled from "styled-components"
import playersFile from "../players.json"

const Versus = () => {

    const [name1, setName1] = useState("")
    const [name2, setName2] = useState("")
    const [stats1, setStats1] = useState("")
    const [stats2, setStats2] = useState("")
    const [img1, setImg1] = useState("")
    const [img2, setImg2] = useState("")
    const [logo1, setLogo1] = useState("")
    const [logo2, setLogo2] = useState("")
    const [bg1, setBg1] = useState("")
    const [bg2, setBg2] = useState("")
    const [reload, setReload] = useState(false)

    const playerArray = playersFile.playersArray
    
    useEffect(() => {
    
        // set random player
        const randomInt1 = Math.floor(Math.random() * playerArray.length)
        const randomInt2 = Math.floor(Math.random() * playerArray.length)
        const player1 = playerArray[randomInt1]
        const player2 = playerArray[randomInt2]
         
        // set states
        let formatted = ""

        formatted = `${player1.firstName} ${player1.lastName}`
        setName1(formatted)
        formatted = `${player2.firstName} ${player2.lastName}`
        setName2(formatted)

        formatted = `#${player1.jersey} | ${player1.pos} | ${player1.heightFeet}"${player1.heightInches} | ${player1.weightPounds} lbs`
        setStats1(formatted)
        formatted = `#${player2.jersey} | ${player2.pos} | ${player2.heightFeet}"${player2.heightInches} | ${player2.weightPounds} lbs`
        setStats2(formatted)

        setImg1(`https://cdn.nba.com/headshots/nba/latest/1040x760/${player1.personId}.png`)
        setImg2(`https://cdn.nba.com/headshots/nba/latest/1040x760/${player2.personId}.png`)

        setLogo1(`https://cdn.nba.com/logos/nba/${player1.teamId}/global/L/logo.svg`)
        setLogo2(`https://cdn.nba.com/logos/nba/${player2.teamId}/global/L/logo.svg`)

        
        switch(player1.teamId){
            case "1610612737":
                setBg1("#864D36")
                break
            case "1610612738":
                setBg1("#096839")
                break
            case "1610612751":
                setBg1("#000000")
                break
            case "1610612766":
                setBg1("#065F70")
                break
            case "1610612741":
                setBg1("#CE1241")
                break
            case "1610612739":
                setBg1("#591E31")
                break
            case "1610612742":
                setBg1("#024396")
                break
            case "1610612743":
                setBg1("#0C1B34")
                break
            case "1610612765":
                setBg1("#1C428A")
                break
            case "1610612744":
                setBg1("#065591")
                break
            case "1610612745":
                setBg1("#CE1241")
                break
            case "1610612754":
                setBg1("#012D61")
                break
            case "1610612746":
                setBg1("#9F0E25")
                break
            case "1610612747":
                setBg1("#552582")
                break
            case "1610612763":
                setBg1("#5D76A9")
                break
            case "1610612748":
                setBg1("#98002E")
                break
            case "1610612749":
                setBg1("#00471B")
                break
            case "1610612750":
                setBg1("#0D2240")
                break
            case "1610612740":
                setBg1("#012B5C")
                break
            case "1610612752":
                setBg1("#156EB6")
                break
            case "1610612760":
                setBg1("#007AC0")
                break
            case "1610612753":
                setBg1("#0177BF")
                break
            case "1610612755":
                setBg1("#1A71B9")
                break
            case "1610612756":
                setBg1("#1D1260")
                break
            case "1610612757":
                setBg1("#D9363C")
                break
            case "1610612758":
                setBg1("#623787")
                break
            case "1610612759":
                setBg1("#000000")
                break
            case "1610612761":
                setBg1("#000000")
                break
            case "1610612762":
                setBg1("#012B5C")
                break
            case "1610612764":
                setBg1("#012B5C")
                break
            default:
                setBg1("#051D2D")
        }
        switch(player2.teamId){
            case "1610612737":
                setBg2("#864D36")
                break
            case "1610612738":
                setBg2("#096839")
                break
            case "1610612751":
                setBg2("#000000")
                break
            case "1610612766":
                setBg2("#065F70")
                break
            case "1610612741":
                setBg2("#CE1241")
                break
            case "1610612739":
                setBg2("#591E31")
                break
            case "1610612742":
                setBg2("#024396")
                break
            case "1610612743":
                setBg2("#0C1B34")
                break
            case "1610612765":
                setBg2("#1C428A")
                break
            case "1610612744":
                setBg2("#065591")
                break
            case "1610612745":
                setBg2("#CE1241")
                break
            case "1610612754":
                setBg2("#012D61")
                break
            case "1610612746":
                setBg2("#9F0E25")
                break
            case "1610612747":
                setBg2("#552582")
                break
            case "1610612763":
                setBg2("#5D76A9")
                break
            case "1610612748":
                setBg2("#98002E")
                break
            case "1610612749":
                setBg2("#00471B")
                break
            case "1610612750":
                setBg2("#0D2240")
                break
            case "1610612740":
                setBg2("#012B5C")
                break
            case "1610612752":
                setBg2("#156EB6")
                break
            case "1610612760":
                setBg2("#007AC0")
                break
            case "1610612753":
                setBg2("#0177BF")
                break
            case "1610612755":
                setBg2("#1A71B9")
                break
            case "1610612756":
                setBg2("#1D1260")
                break
            case "1610612757":
                setBg2("#D9363C")
                break
            case "1610612758":
                setBg2("#623787")
                break
            case "1610612759":
                setBg2("#000000")
                break
            case "1610612761":
                setBg2("#000000")
                break
            case "1610612762":
                setBg2("#012B5C")
                break
            case "1610612764":
                setBg2("#012B5C")
                break
            default:
                setBg2("#051D2D")
        }

    }, [reload, playerArray])

    const VersusContainer = styled.main`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: ${window.innerHeight};

        & .panel{
            height: 50vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
            
            & .info{
                margin: auto;
                z-index: 1;
                position: relative;
            }
            & .logo{
                height: 10%;
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
        <VersusContainer>
            <div className='panel' style={{backgroundColor: bg1}}>
                <div className='info'>
                    <div>
                        <div className='name'>{name1}</div>
                        <div className='stats'>{stats1}</div>
                    </div>
                </div>
                <img className='logoBG' src={logo1} alt="logo1" />
                <img className='player' src={img1} alt="player1" />
            </div>
            <div className='panel' style={{backgroundColor: bg2}}>
                <div className='info'>
                    <div className='name'>{name2}</div>
                    <div className='stats'>{stats2}</div>
                </div>
                    <img className='logoBG' src={logo2} alt="logo2" />
                <img className='player' src={img2} alt="player2" />
            </div>
        </VersusContainer>
     );
}
 
export default Versus;