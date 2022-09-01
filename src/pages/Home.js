import { useState, useEffect } from 'react';

// css
import '../App.css';

// component
import Sidebar from '../component/sidebar/Sidebar';
import Navbar from '../component/navbar/Navbar';
import Card from '../component/card/Card';
import PageLoader from '../component/loader/PageLoader';
import ButtonLoader from '../component/loader/ButtonLoader';

// data
import { API } from '../config/api';

import empty from '../icon/empty.png';

const Home = () => {

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [limit, setLimit] = useState(8);
    const [isFinish, setIsFinish] = useState(false);
    const [loadShowMore, setLoadShowMore] = useState(false);

    const getVideos = async () => {
        try {
            setLoading(true);

            const response = await API.get(`/videos/${0}/${limit}`);

            if(response.data.status !== "success"){
                setError(true);
                return;
            }

            setVideos(response.data.data.videos);
            setIsEmpty((response.data.data.videos.length < 1)? true:false);
            setLoading(false);

        } catch(err){
            console.log(err);
            setLoading(false);
        }
    }

    const showMore = async () => {
        try {
            setLoadShowMore(true);
            const tmpData = [...videos];
            const lastIndex = tmpData.length;

            const response = await API.get(`/videos/${lastIndex}/${limit}`);

            if(response.data.data.videos.length === 0){
                setIsFinish(true);
            }

            for(let i = 0; i < response.data.data.videos.length; i++){
                tmpData[lastIndex + i] = response.data.data.videos[i]
            }

            setVideos(tmpData);
            setLoadShowMore(false);
        } catch(err){
            console.log(err);
            setLoadShowMore(false);
        }
    }

    useEffect(() => {
        getVideos();
    }, []);

    console.log(isEmpty);

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
                <>
                    {!isEmpty ? (
                        <div className="card-content">
                            {videos.map(video => {                       
                                return <Card 
                                            key={video.id} 
                                            data={video}
                                            edit={false} 
                                        />
                            })}
                        </div>
                    ): (<div className="empty-subscribtion">
                            <img src={empty} alt="empty" />
                            <h3>There is No Video</h3>
                        </div>)
                    }
        
                    {isFinish ? (
                        null
                    ):!isEmpty && (
                        <div className="show-more-videos-wrapper">
                            <button onClick={showMore} className="show-more-videos">
                                {loadShowMore ? (
                                    <ButtonLoader />
                                ): (
                                    "Show More"
                                )}    
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    </div>
        
   )
}

export default Home;