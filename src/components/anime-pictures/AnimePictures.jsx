import React, { useEffect, useState } from 'react';
import Gallery from 'devextreme-react/gallery';
import { usePostRequestSyncPromise } from '../../global/GlobalFetch'; // Path'inizin doğru olduğundan emin olun

const AnimePictures = ({ animeId }) => {
    const [pictures, setPictures] = useState([]);
    const postRequestSyncPromise = usePostRequestSyncPromise();

    useEffect(() => {
        const fetchPictures = async () => {
            try {
                const response = await postRequestSyncPromise("Anime/AnimePictures", { series_animedb_id : animeId });
                if (response && response.data) {
                    // Resimlerin hem jpg hem de webp formatlarını ele alabilirsiniz veya sadece birini seçebilirsiniz
                    const imageUrls = response.data.map(imageInfo => imageInfo.jpg.large_image_url || imageInfo.webp.large_image_url);
                    setPictures(imageUrls);
                }
            } catch (error) {
                console.error("Error fetching anime pictures:", error);
            }
        };

        fetchPictures();
    }, [animeId, postRequestSyncPromise]);

    return (
        <div>
            <Gallery
                dataSource={pictures}
                height={"auto"}
                loop={true}
                showNavButtons={true}
                showIndicator={true}
                slideshowDelay={2000} // 2 saniye aralıklarla otomatik geçiş
            />
        </div>
    );
};

export default AnimePictures;
