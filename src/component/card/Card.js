import './card.css';
import {Link} from 'react-router-dom';
import {useState} from 'react';
import number_views from '../../icon/number_views.svg';
import refresh_icon from '../../icon/refresh_icon.svg';
import remove from '../../icon/remove.png';

import Modal from '../modal/Modal';


const Card = (props) => {
    const [modal, setModal] = useState(false);
    const [videoId, setVideoId] = useState(null);

    const showModal = () => {
        setVideoId(props.data.id);
        setModal(true);
    }
    
    const closeModal = () => {
        setVideoId(null);
        setModal(false);
    }

    const deleteVideo = () => {
        props.actionDelete(videoId);
        setModal(false);
    }

    return(
        <div className="card">
            {modal && (<Modal closemodal={() => { closeModal() }} actionDelete={() => deleteVideo()}/>)}
            <div className="card-thumbnail-container">
                <Link to={`/detail/${props.data.id}`} className="link">
                    <img src={JSON.parse(props.data.thumbnail).path} alt="card_thumbnail" className="card-thumbnail" />
                </Link>
                {props.edit && (
                    <button className="btn-delete" onClick={showModal}>
                        <img src={remove} alt="remove" />
                    </button>
                )}
            </div>
            <Link to={`/detail/${props.data.id}`} className="link">
                <h1 className="card-title">{props.data.title}</h1>
            </Link>
            <Link to={`/content-creator/${props.data.chanel.id}`} className="link">
                <p className="card-username">{props.data.chanel.chanelName}</p>
            </Link>
            <span>
                <img src={number_views} alt="number_views" /> {props.data.viewCount}
            </span>
            <span>
                <img src={refresh_icon} alt="refresh_icon" /> {new Date(props.data.createdAt).toLocaleDateString()}
            </span>
        </div>
    )
}

export default Card;