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
    const [reload, setReload] = useState(false)

    const playerArray = playersFile.playersArray
    
    useEffect(() => {
    
        const randomInt1 = Math.floor(Math.random() * playerArray.length)
        const randomInt2 = Math.floor(Math.random() * playerArray.length)
        const player1 = playerArray[randomInt1]
        const player2 = playerArray[randomInt2]
        

        if(player1.country === "" || player2.country === "") {
            console.log(player1)
            console.log(player2)
            setReload((prev) => !prev)
        }
        
        let formatted = `${player1.firstName} ${player1.lastName}`
        setName1(formatted)
        formatted = `${player2.firstName} ${player2.lastName}`
        setName2(formatted)

        formatted = `#${player1.jersey} | ${player1.pos} | ${player1.heightFeet}"${player1.heightInches} | ${player1.weightPounds} lbs`
        setStats1(formatted)
        formatted = `#${player2.jersey} | ${player2.pos} | ${player2.heightFeet}"${player2.heightInches} | ${player2.weightPounds} lbs`
        setStats2(formatted)



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
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            
            & img{
                object-fit: contain;
                width: 100%;
            }
        }
    `
    

    return ( 
        <VersusContainer>
            <div className='panel'>
                <div>
                    <h1>{name1}</h1>
                    <h4>{stats1}</h4>
                </div>
                <img src={img1} alt="basketball" />
            </div>
            <div className='panel'>
                <div>
                    <h1>{name2}</h1>
                    <h4>{stats2}</h4>
                </div>
                <img src={img2} alt="basketball" />
            </div>
        </VersusContainer>
     );
}
 
export default Versus;