import styled from "styled-components"

function Spinner(props) {
    const SpinnerContainer = styled.div`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        & .lds-ripple {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
            ${props.size === "small" && "width: 40px; height 40px;"}
        }
        & .lds-ripple div {
            position: absolute;
            border: 4px solid #fff;
            opacity: 1;
            border-radius: 50%;
            animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
        & .lds-ripple div:nth-child(2) {
            animation-delay: -0.5s;
        }
        @keyframes lds-ripple {
            0% {
                top: 36px;
                left: 36px;
                width: 0;
                height: 0;
                opacity: 0;
                ${props.size === "small" && "top: 18px; left 18px;"}
            }
            4.9% {
                top: 36px;
                left: 36px;
                width: 0;
                height: 0;
                opacity: 0;
                ${props.size === "small" && "top: 18px; left 18px;"}
            }
            5% {
                top: 36px;
                left: 36px;
                width: 0;
                height: 0;
                opacity: 1;
                ${props.size === "small" && "top: 18px; left 18px;"}
            }
            100% {
                top: 0px;
                left: 0px;
                width: 72px;
                height: 72px;
                opacity: 0;
                ${props.size === "small" && "width: 36px; height 36px;"}
            }
        }
    `
    return (
        <SpinnerContainer>
            <div class="lds-ripple">
                <div></div>
                <div></div>
            </div>
        </SpinnerContainer>
    )
}

export default Spinner
