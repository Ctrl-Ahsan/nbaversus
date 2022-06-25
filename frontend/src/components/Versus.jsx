import { useState, useEffect } from 'react';
import players from "../players2022"

const Versus = () => {
    
    const [img1, setImg1] = useState("")
    const [img2, setImg2] = useState("")
    const [reload, setReload] = useState(false)
    
    useEffect(() => {
    
        const playerArray = players.league.standard
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

    return ( 
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%"}}>
            <img src={img1} alt="basketball" />
            <img src={img2} alt="basketball" />
        </div>
     );
}
 
export default Versus;