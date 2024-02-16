import React, { useEffect, useState } from 'react';
import { DataGrid, Column, Paging, Pager } from 'devextreme-react/data-grid';
import { usePostRequestSyncPromise } from "../../global/GlobalFetch";
import { Button } from 'devextreme-react/button';

const AnimeStaffGridProfile = ({ data: series_animedb_id }) => {
    const [staffData, setStaffData] = useState([]);
    const postRequestSyncPromise = usePostRequestSyncPromise();

    useEffect(() => {
        if (series_animedb_id) {
            postRequestSyncPromise("Anime/AnimeStaff", { mal_id : series_animedb_id })
                .then(response => {
                    setStaffData(response.data);
                })
                .catch(error => {
                    console.error("Error fetching staff details:", error);
                });
        }
    }, [series_animedb_id, postRequestSyncPromise]);

    return (
        <div>
            <div className="detail-container">
                <div className="detail-header">
                    <span className="detail-title">Staff Details</span>
                </div>
                <DataGrid
                    dataSource={staffData}
                    keyExpr="person.mal_id"
                    showBorders={true}
                    showColumnHeaders={false}
                    columnAutoWidth={true}
                >
                    <Paging enabled={true} defaultPageSize={3} />
                    <Pager
                        showPageSizeSelector={true}
                        allowedPageSizes={[3, 5, 10]}
                        showInfo={true}
                        showNavigationButtons={true}
                    />
                    <Column
                        dataField="combined"
                        caption="Details"
                        cellRender={(data) => {
                            return (
                                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <img
                                        src={data.data.person.images.jpg.image_url}
                                        alt="Staff Image"
                                        style={{
                                            width: '180px',
                                            height: '180px',
                                            borderRadius: '5px',
                                            marginRight: '10px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => window.open(data.data.person.images.jpg.image_url, '_blank')}
                                    />
                                    <div>
                                        <div><strong>Name:</strong> {data.data.person.name}</div>
                                        <div><strong>Positions:</strong> {data.data.positions.join(', ')}</div>
                                    </div>
                                    <Button
                                        onClick={() => window.open(data.data.person.url, '_blank', 'noopener,noreferrer')}
                                        icon='info'
                                        style={{
                                            marginLeft: 'auto',
                                        }}
                                    >
                                    </Button>
                                </div>
                            );
                        }}
                    />
                </DataGrid>
            </div>
        </div>
    );
};

export default AnimeStaffGridProfile;
