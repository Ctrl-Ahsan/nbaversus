import styled from "styled-components"

function Spinner() {
    const SpinnerContainer = styled.div`
        position: relative;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 5000;
        display: flex;
        justify-content: center;
        align-items: center;

        & .loadingSpinner {
            width: 64px;
            height: 64px;
            border: 8px solid;
            border-color: #000 transparent #555 transparent;
            border-radius: 50%;
            animation: spin 1.2s linear infinite;
        }
    `
    return (
        <SpinnerContainer>
            <div className="loadingSpinner"></div>
        </SpinnerContainer>
    )
}

export default Spinner
