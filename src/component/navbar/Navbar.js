import {useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import './navbar.css';
import add_video_icon from '../../icon/add_video_icon.svg';
import add_video_icon_active from '../../icon/add_video_icon_active.svg';
import Dropdown from '../dropdown/Dropdown';

const Navbar = () => {
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const pathName = window.location.pathname;
    const [isDropdown, setDropdown] = useState(false);
    const history = useHistory();

    const handleDropdown = () => {
        isDropdown? setDropdown(false):setDropdown(true);
    }

    const getUser = () => {
        if(!currentUser){
            setLoading(true);
        } else {
            setLoading(false);
            
        }
    }

    useEffect(() => {
        getUser();
    },[currentUser])

    useEffect(() => {
        return history.listen(() => {
            setDropdown(false);
        })
    }, [history]);

    return(
        <div className="navbar">
            <div className="search-bar">
                <input type="text" placeholder="Search..."/>
            </div>
            <div className="navbar-menu">
                <ul className="navbar-menu-list">
                    <li className="navbar-menu-item">
                        <Link to='/add' className="navbar-menu-link link">
                            <img src={pathName === '/add'? add_video_icon_active:add_video_icon} alt="add_video_icon"/>
                            <span className={pathName === '/add'? 'active':''}>Add Video</span>
                        </Link>
                    </li>

                    <li className="navbar-menu-item">
                        <button className="navbar-menu-button" onClick={handleDropdown}>
                            {loading && !currentUser ? "":<img src={JSON.parse(currentUser.photo).path} alt="add_video_icon"/>}
                        </button>
                        {isDropdown ? <Dropdown/>: ""}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar;