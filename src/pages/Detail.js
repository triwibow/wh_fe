import { useState, useEffect, useContext } from 'react';
import {useParams} from 'react-router-dom';

// css
import '../App.css';

// component
import Video from '../component/video/Video';
import Card from '../component/card/Card';
import Sidebar from '../component/sidebar/Sidebar';
import Navbar from '../component//navbar/Navbar';
import PageLoader from '../component/loader/PageLoader';

import { AppContext } from '../context/AppContext';

import { API } from '../config/api';

const Detail = () => {
    const [state, dispatch] = useContext(AppContext);
    const { id } = useParams();

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [video, setVideo] = useState();
    const [recomendationVideos, setRecomendationVideos] = useState([]);
    const [channel, setChanel] = useState();
    const [comments, setComments] = useState([]);
    const [subscribers, setSubscribers] = useState();
    const [maxShow, setMaxShow] = useState(3);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const randomIndex = (max) => {
        const randomNumber = [];

        for(let i = 0; i < max; i++){
            let newNumber = Math.floor(Math.random() * max);
            
            const checkNumber = randomNumber.indexOf(newNumber);
            
            if(checkNumber < 0){
                randomNumber.push(newNumber);
            } else {
                i--;
            }
            
        }
        return randomNumber;
        
    }

    const getVideos = async () => {
        try {
            const response = await API.get('/videos');
            const numbers = randomIndex(response.data.data.videos.length);
            const randomVideos = []
            numbers.forEach(number => {
                randomVideos.push(response.data.data.videos[number]);
            });
            setRecomendationVideos(randomVideos);

        } catch(err){
            console.log(err);
        }
    }

    const showMore = () => {
        setMaxShow(maxShow + 2);
    }
    

    const getSubscribtion = async () => {
        try {
            const subscribtions = await API.get('/subscribe');

            if(subscribtions.data.status === "success"){
                dispatch({
                    type: "LOAD_SUBSCRIBTION",
                    payload: subscribtions.data.data
                });
                return;
            }

        } catch(err){
            console.log(err)
        }
    }


    const getVideoById = async () => {
        try {
            setLoading(true);

            const response = await API.get(`/video/${id}`);

            const chanelId = response.data.data.video.chanel.id;

            const chanelById = await API.get(`/chanel/${chanelId}`);

            if(response.data.status !== "success"){
                setError(true);
                setLoading(false);
                return;
            }

            if(chanelById.data.status !== "success"){
                setError(true);
                setLoading(false);
                return;
            }

            setChanel(chanelById.data.data.chanel);
            setSubscribers(chanelById.data.data.chanel.subscribers.length);
            setVideo(response.data.data.video);
            setComments(response.data.data.video.comments.reverse());
            setLoading(false);

        } catch(err){
            console.log(err);
        }
    }

    const checkSubscribe = async () => {
        try {
            const body = {
                chanelId: video.chanel.id
            }


            const response = await API.post('/check-subscribe', body);

            if(response.data.status === "success"){
                return true;
                
            }

            return false;
            
        } catch(err){
            console.log(err);
        }
    }

    const doSubscribe = async () => {
        try {

            const body = {
                chanelId: video.chanel.id
            }

            const response = await API.post('/subscribe', body);

            if(response.data.status === "success"){
                setSubscribers(subscribers + 1);
                const subscribe = [...state.subscribtion];
                subscribe.push(response.data.data.subscribe.chanel);
                const subsbribtionAfterSubscribe = {
                    subscribtion: subscribe
                }

                dispatch({
                    type: "SUBSCRIBE",
                    payload: subsbribtionAfterSubscribe
                });

                
                return;
            }

            return;
            
        } catch(err){
            console.log(err);
        }
    }

    const doUnSubscribe = async () => {
        try {

            const chanelId = video.chanel.id;

            const response = await API.delete(`/subscribe/${chanelId}`);

            if(response.data.status === "success"){
                const indexUnsubsribe = state.subscribtion.findIndex(subscribtion => subscribtion.id === parseInt(response.data.data.id));
                
                const subscribe = [...state.subscribtion];
                subscribe.splice(indexUnsubsribe, 1);
                const subsbribtionAfterUnSubscribe = {
                    subscribtion: subscribe
                }

                dispatch({
                    type: "UNSUBSCRIBE",
                    payload: subsbribtionAfterUnSubscribe
                });

                setSubscribers(subscribers- 1);
                return;
            }

            return;
            
        } catch(err){
            console.log(err);
        }
    }

    const addComment = async (formData) => {
        try {  
            const videoId = video.id 
            const response = await API.post(`/video/${videoId}/comment`, formData);

            if(response.data.status === "success"){
                setComments([
                    response.data.data.comment,
                    ...comments
                    
                ]);
            }

        } catch(err){
            console.log(err);
        }
    }

    const deleteComment = async (commentId) => {
        try {
            const videoId = video.id;

            const response = await API.delete(`/video/${videoId}/comment/${commentId}`);

            if(response.data.status === "success"){
                const indexDeletedComment = comments.findIndex(comment => comment.id === commentId);
                const commentsAfterDelete = [...comments];
                commentsAfterDelete.splice(indexDeletedComment, 1);
                setComments(commentsAfterDelete);
                return;
            }
            

        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getSubscribtion();
        getVideoById();
        getVideos();
        
    },[id]);

    
    return(
        <div className="wrapper">
            <Sidebar />
            <div className="container">
                <Navbar />
                    {error ? (
                        <h1>Server Error</h1>
                    ): loading ? (
                        <PageLoader />
                    ):(
                        
                        <div className="video-container">
                            <Video 
                                currentUser={currentUser}
                                subscribers={subscribers}
                                subscribe={() => doSubscribe()}
                                unSubscribe = {() => doUnSubscribe()} 
                                data={video}
                                chanel={channel}
                                checkSubscribe={() => checkSubscribe()}
                                comments={comments}
                                addComment={async (formData) => await addComment(formData)}
                                deleteComment={async (commentId) => await deleteComment(commentId)}
                            />
                            <div className="recomendation-video">
                                {recomendationVideos.map(recomendVideo => {
                                    return (recomendationVideos.indexOf(recomendVideo) > maxShow) ? (null):
                                    (recomendVideo.id === video.id)? (null): (
                                    <Card 
                                            key={recomendVideo.id} 
                                            data={recomendVideo}
                                            edit={false} 
                                        />
                                    )
                                    
                                })}
                                {maxShow > recomendationVideos.length ? 
                                        null
                                    :
                                        <button onClick={showMore} className="show-more-videos">Show More</button>}
                            </div>
                           
                        </div>
                    )}           
            </div>
        </div>
        
   )
}

export default Detail;