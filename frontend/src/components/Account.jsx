import styled from "styled-components"
import User from "./User"

const Account = () => {
    const AccountContainer = styled.main`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 92%;
        width: 100%;
        overflow-y: auto;
        background: linear-gradient(270deg, #860000, #013a6b);

        @media screen and (min-width: 1080px) {
            height: 100%;
        }
    `
    return (
        <AccountContainer>
            <User />
        </AccountContainer>
    )
}

export default Account
