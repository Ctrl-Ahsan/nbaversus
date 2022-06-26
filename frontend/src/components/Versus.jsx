import { useState, useEffect } from 'react';
import styled from "styled-components"
import playersFile from "../players.json"

const Versus = () => {

    
    const [img1, setImg1] = useState("")
    const [img2, setImg2] = useState("")
    const [reload, setReload] = useState(false)

    const playerArray = playersFile.playersArray
    
    useEffect(() => {
    
        const randomInt1 = Math.floor(Math.random() * playerArray.length)
        const player1 = playerArray[randomInt1]
        const randomInt2 = Math.floor(Math.random() * playerArray.length)
        const player2 = playerArray[randomInt2]
        

        if(player1.country === "" || player2.country === "") {
            console.log(player1)
            console.log(player2)
            setReload((prev) => !prev)
        }
        
        
        setImg1(`https://cdn.nba.com/headshots/nba/latest/260x190/${player1.personId}.png`)
        setImg2(`https://cdn.nba.com/headshots/nba/latest/260x190/${player2.personId}.png`)
    }, [reload])

    const VersusContainer = styled.main`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;

        & .panel{
            height: 50vh;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            
            & img{
                object-fit: contain;
                width: 100%;
            }
        }
    `
    

    return ( 
        <VersusContainer>
            <div className='panel'>
                <h1></h1>
                <img src={img1} alt="basketball" />
            </div>
            <div className='panel'>
                <h1></h1>
                <img src={img2} alt="basketball" />
            </div>
        </VersusContainer>
     );
}
 
export default Versus;