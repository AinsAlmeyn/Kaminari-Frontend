import React, { useEffect, useState } from 'react';
import { DataGrid, Column, Paging, Pager } from 'devextreme-react/data-grid';
import { usePostRequestSyncPromise } from "../../global/GlobalFetch";
import '../anime-character/animeCharacter.css'; // CSS dosyasının yolu doğru olduğundan emin olun.

const AnimeCharacters = ({ data }) => {
    const [charactersData, setCharactersData] = useState([]);
    const postRequestSyncPromise = usePostRequestSyncPromise();

    useEffect(() => {
        postRequestSyncPromise("Anime/AnimeCharacters", { mal_id: data.mal_id })
            .then(response => {
                setCharactersData(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [data.mal_id, postRequestSyncPromise]);

    const onImageClick = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="detail-container">
            <div className="detail-header">
                <span className="detail-title">Characters & Voice Actors</span>
            </div>
            <DataGrid
                dataSource={charactersData}
                keyExpr="character.mal_id"
                showBorders={true}
                columnAutoWidth={true}
            >
                <Paging enabled={true} defaultPageSize={3} />
                <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={[3, 5, 10]}
                    showInfo={true}
                    showNavigationButtons={true}
                />
                <Column dataField="character" caption="Character" calculateDisplayValue="character.name" cellRender={({ data }) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={data.character.images.jpg.image_url}
                            alt={data.character.name}
                            style={{ width: '70px', height: '90px', marginRight: '10px', cursor: 'pointer' }}
                            onClick={() => onImageClick(data.character.images.jpg.image_url)}
                        />
                        <a href={data.character.url} target="_blank" rel="noopener noreferrer">{data.character.name}</a>
                    </div>
                )} />
                <Column
                    caption="Details"
                    cellRender={({ data }) => (
                        <div>
                            <div><strong>Role:</strong> {data.role}</div>
                            <div><strong>Favorites:</strong> {data.favorites.toLocaleString()}</div>
                        </div>
                    )}
                />
                <Column
                    dataField="voice_actors"
                    caption="Voice Actors"
                    cellRender={({ data }) => (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {data.voice_actors.map((actor, index) => (
                                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img
                                        src={actor.person.images.jpg.image_url}
                                        alt={actor.person.name}
                                        style={{ width: '70px', height: '90px', cursor: 'pointer' }}
                                        onClick={() => onImageClick(actor.person.images.jpg.image_url)}
                                    />
                                    <a href={actor.person.url} target="_blank" rel="noopener noreferrer">{actor.person.name}</a>
                                    <small>{actor.language}</small>
                                </div>
                            ))}
                        </div>
                    )}
                />
            </DataGrid>
        </div>
    );
};

export default AnimeCharacters;
