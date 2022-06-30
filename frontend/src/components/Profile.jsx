import styled from "styled-components"
import { useDispatch } from "react-redux"
import { FaSignOutAlt } from "react-icons/fa"
import { logout, reset } from "../features/auth/authSlice"

const Profile = () => {
    const dispatch = useDispatch()

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
    }

    const ProfileContainer = styled.div``

    return (
        <ProfileContainer>
            <button className="logout" onClick={onLogout}>
                <FaSignOutAlt /> Logout
            </button>
        </ProfileContainer>
    )
}

export default Profile
