import { useState, useEffect } from 'react';

// css
import '../App.css';

// component
import Sidebar from '../component/sidebar/Sidebar';
import Navbar from '../component/navbar/Navbar';
import Card from '../component/card/Card';
import PageLoader from '../component/loader/PageLoader';

// data
import { API } from '../config/api';

const Home = () => {

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);

    const getVideos = async () => {
        try {
            setLoading(true);

            const response = await API.get('/videos');

            if(response.data.status !== "success"){
                setError(true);
                return;
            }

            setVideos(response.data.data.videos.reverse());
            setLoading(false);

        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getVideos();
    }, []);

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
                <div className="card-content">
                    {videos.map(video => {                       
                        return <Card 
                                    key={video.id} 
                                    data={video}
                                    edit={false} 
                                />
                    })}
                </div>
            )}
        </div>
    </div>
        
   )
}

export default Home;