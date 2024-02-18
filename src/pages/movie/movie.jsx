import React, { useEffect, useState } from 'react';
import { Row, Col } from "reactstrap";
import {
    Column,
    DataGrid,
    MasterDetail,
    GroupPanel,
    ColumnChooser,
    FilterRow,
    HeaderFilter,
    Editing,
    Form,
    Popup,
} from "devextreme-react/data-grid";
import { Button, TextBox, SelectBox, } from 'devextreme-react';
import { usePostRequestSyncPromise } from "../../global/GlobalFetch";
import TabPanel, { Item } from 'devextreme-react/tab-panel';
import ReactPaginate from 'react-paginate';
import MovieDetailTab from '../../components/movie-detail/MovieDetailTab';
import MovieWatch from '../../components/movie-watch/MovieWatch';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.js';

const MovieDetails = ({ data }) => {
    return (
        <TabPanel>
            <Item icon='fa-solid fa-list-check' title="Movie Detail" component={() => <MovieDetailTab data={data} />} />
            <Item icon='fa-solid fa-play' title="Movie Detail" component={() => <MovieWatch data={data} />} />
        </TabPanel>
    );
};

const scoreOptions = [
    { id: '0', name: 'No Score', icon: 'far fa-circle' },
    { id: '1', name: '1', icon: 'fas fa-seedling' },       // Tohum, bir başlangıcı simgeler
    { id: '2', name: '2', icon: 'fas fa-spa' },            // Filiz, büyümeye başlandığını simgeler
    { id: '3', name: '3', icon: 'fas fa-leaf' },           // Yaprak, gelişmeyi simgeler
    { id: '4', name: '4', icon: 'fas fa-apple-alt' },      // Elma, olgunlaşmayı simgeler
    { id: '5', name: '5', icon: 'fa-solid fa-fan' },         // Çiçek, güzelliği simgeler
    { id: '6', name: '6', icon: 'fas fa-tree' },           // Ağaç, güç ve istikrarı simgeler
    { id: '7', name: '7', icon: 'fas fa-mountain' },       // Dağ, zirveye ulaşmayı simgeler
    { id: '8', name: '8', icon: 'fas fa-globe-americas' }, // Küre, küresel etkiyi simgeler
    { id: '9', name: '9', icon: 'fas fa-rocket' },         // Roket, yeniliği ve yüksek başarıyı simgeler
    { id: '10', name: '10', icon: 'fas fa-crown' }         // Taç, zirvede olmayı ve en yüksek başarıyı simgeler
];

const movieStatuses = [
    { id: 'Completed', name: 'Completed' },
    { id: 'Dropped', name: 'Dropped' },
    { id: 'On-Hold', name: 'On-Hold' },
    { id: 'Plan to Watch', name: 'Plan to Watch' },
    { id: 'Watching', name: 'Watching' }
];

export default function Movie() {

    //! IS MOBILE
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    //! PAGE STATE
    const [pageCountInfo, setPageCountInfo] = useState(1);
    const [isSearchActive, setIsSearchActive] = useState(false);

    //! GLOBAL FETCH
    const postRequestSyncPromise = usePostRequestSyncPromise();

    //! MOVIE SEARCH
    const [movieSearchTextboxValue, setMovieSearchTextboxValue] = useState("");

    //! DATAGRID STATE
    const [searchedMovieDataSource, setSearchedMovieDataSource] = useState([]);

    useEffect(() => {
        DiscoverMovie(1);
    }, []);

    //! IS MOBILE
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //! PAGE FUNCTIONS
    const handlePageClick = (data) => {
        let selectedPage = data.selected + 1;
        setSearchedMovieDataSource([]);
        if (isSearchActive) {
            SearchMovie(selectedPage);
        } else {
            DiscoverMovie({ page: selectedPage });
        }
    };

    //! DISCOVER MOVIE
    function DiscoverMovie(page) {
        let pageInformation = 1;
        if (page === undefined || page === null) {
            pageInformation = 1;
        }
        else {
            pageInformation = page;
        }

        const discoverFilter = {
            include_adult: true,
            language: "tr-TR",
            page: pageInformation.page
        };

        const baseRequest = {
            RequestId: "unique_request_id",
            Sender: "client_discover_movie",
            Data: [discoverFilter]
        };

        postRequestSyncPromise("Movie/DiscoverMovie", baseRequest)
            .then(data => {
                setSearchedMovieDataSource(data.data[0].results);
                setPageCountInfo(500);
            })
            .catch(error => {
                console.error();
            });
    }

    //! SEARCH MOVIE
    function SearchMovie(page = 1) {
        const searchFilter = {
            query: movieSearchTextboxValue,
            language: "tr-TR",
            page: page
        };

        const baseRequest = {
            RequestId: "unique_request_id",
            Sender: "client_search_movie",
            Data: [searchFilter]
        };

        postRequestSyncPromise("Movie/SearchMovie", baseRequest)
            .then(data => {
                setSearchedMovieDataSource(data.data[0].results);
                setPageCountInfo(data.total_pages);
            })
            .catch(error => {
                console.error();
            });
    }

    //! FORMAT DATE
    const formatDate = (date) => {
        return date ? new Intl.DateTimeFormat('en-US').format(new Date(date)) : '';
    };

    //! RENDER DETAIL GRID
    const renderDetailGrid = (row) => {
        return <MovieDetails data={row.data.data.id} />;
    };

    //! DATAGRID ACTIONS
    async function onRowUpdating(e) {
        e.cancel = new Promise(async (resolve) => {

            if (e.newData.my_score == null || e.newData.my_status == null) {
                console.log("my_score veya my_status için geçerli bir değer sağlanmadı. Güncelleme işlemi iptal ediliyor.");
                resolve(true);
                return;
            }

            const userId = localStorage.getItem("userId");
            const postData = {
                adult: e.oldData.adult,
                backdrop_path: e.oldData.backdrop_path,
                genre_ids: e.oldData.genre_ids,
                id: e.oldData.id,
                original_language: e.oldData.original_language,
                original_title: e.oldData.original_title,
                overview: e.oldData.overview,
                popularity: e.oldData.popularity,
                poster_path: e.oldData.poster_path,
                release_date: e.oldData.release_date,
                title: e.oldData.title,
                video: e.oldData.video,
                vote_average: e.oldData.vote_average,
                vote_count: e.oldData.vote_count,
                my_score: e.newData.my_score,
                my_status: e.newData.my_status,
                userId: userId,
            };

            const baseRequest = {
                RequestId: "unique_request_id",
                Sender: "client_discover_movie",
                Data: [postData]
            };

            postRequestSyncPromise("UserMovieProfile/UpsertMovieToUserList", baseRequest)
                .then(data => {
                    resolve(false);
                })
                .catch(error => {
                    resolve(true);
                });
        });
    };

    const dekstopPage = () => {
        return (
            <div>
                <Row>
                    <Col xs="6">
                        <TextBox
                            value={movieSearchTextboxValue}
                            onValueChanged={(e) => setMovieSearchTextboxValue(e.value)}
                            onEnterKey={(e) => {
                                SearchMovie(1);
                            }}
                            label='Search Movie or Tv Show'
                            labelMode='floating'
                            showClearButton={true}
                        />
                    </Col>
                    <Col xs="3">
                        <Button
                            text="Search Movie"
                            type="default"
                            width={"100%"}
                            height={"100%"}
                            stylingMode="contained"
                            onClick={() => {
                                SearchMovie(1);
                            }}
                            style={{ color: 'white' }}
                        />
                    </Col>
                    <Col xs="3">
                        <Button
                            text="Discover Movie"
                            type="default"
                            width={"100%"}
                            height={"100%"}
                            stylingMode="contained"
                            onClick={() => {
                                setMovieSearchTextboxValue("");
                                DiscoverMovie(1);
                            }}
                            style={{ color: 'white' }}
                        />
                    </Col>
                </Row>
                <br />
                <Row>
                    <DataGrid
                        dataSource={searchedMovieDataSource}
                        keyExpr="id"
                        allowColumnReordering={true}
                        allowColumnResizing={true}
                        columnAutoWidth={true}
                        wordWrapEnabled={true}
                        hoverStateEnabled={true}
                        cellHintEnabled={true}
                        showBorders={true}
                        height={window.innerHeight - 200}
                        scrolling={{
                            mode: "standard",
                            showScrollbar: "always",
                            columnRenderingMode: "standard"
                        }}
                        showColumnHeaders={true}
                        showColumnLines={true}
                        showRowLines={true}
                        searchPanel={{
                            visible: true,
                            placeholder: "Search...",
                            highlightSearchText: true,
                            width: 240,
                            highlightCaseSensitive: true,
                            searchVisibleColumnsOnly: false,
                        }}
                        onRowUpdating={onRowUpdating}
                        onEditingStart={(e) => {
                            e.component.columnOption("my_status", "editorOptions", {
                                defaultValue: e.data.my_status,
                            });
                            e.component.columnOption("my_score", "editorOptions", {
                                defaultValue: e.data.my_score,
                            });
                        }}
                    >
                        <FilterRow visible={true} />
                        <HeaderFilter visible={true} />
                        <GroupPanel visible={true} />
                        <ColumnChooser enabled={true} />

                        <MasterDetail
                            enabled={true}
                            component={renderDetailGrid}
                        />

                        {/* <Editing
                            mode="popup"
                            allowUpdating={true}
                        >
                            <Popup title="Anime Update" showTitle={true} width={'25%'} height={'20%'} />
                            <Form>
                                <Item itemType="group" colCount={2} colSpan={2}>
                                    <Item
                                        dataField="my_status"
                                        editorType="dxSelectBox"
                                        editorOptions={{
                                            items: movieStatuses,
                                            valueExpr: "id",
                                            displayExpr: "name",
                                            value: ''
                                        }}
                                        label={{ text: "Select Status", showColonAfterLabel: true }}
                                    />
                                    <Item
                                        dataField="my_score"
                                        editorType="dxSelectBox"
                                        editorOptions={{
                                            items: scoreOptions,
                                            valueExpr: "id",
                                            displayExpr: "name",
                                            value: ''
                                        }}
                                        label={{ text: "Select Score", showColonAfterLabel: true }}
                                    />
                                </Item>
                            </Form>
                        </Editing> */}

                        <Column
                            dataField="my_score"
                            visible={false}
                        />
                        <Column
                            dataField="my_status"
                            visible={false}
                        />
                        <Column
                            dataField="poster_path"
                            caption="Image"
                            cellRender={(data) => {
                                const imageUrl = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.data.poster_path}`;
                                return (
                                    <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                                        <img src={imageUrl} alt="Poster" onClick={() => window.open(`https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.data.poster_path}`, '_blank')} style={{ maxWidth: '250px', maxHeight: '250px' }} />
                                    </div>
                                );
                            }}
                        />

                        <Column
                            dataField="title"
                            caption='Movie Details'
                            width={'50%'}
                            cellRender={(data) => {
                                let combinedTitleElement = (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '4px', color: 'white' }}>{data.data.title}</span>
                                        <span style={{ fontSize: '14px', color: 'white', marginBottom: '4px' }}>{data.data.original_title}</span>
                                        <p style={{ fontSize: '14px', color: 'white', lineHeight: '1.5', backgroundColor: '#3e5c76', padding: '8px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', width: '100%', boxSizing: 'border-box' }}>
                                            {data.data.overview}
                                        </p>
                                    </div>
                                );

                                return (
                                    <td colSpan={4} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 0 }}>
                                        {combinedTitleElement}
                                    </td>
                                );
                            }}
                        />


                        <Column dataField='adult' caption='Adult' />
                        <Column
                            dataField="release_date"
                            caption="Release Date"
                            dataType="date"
                            cellRender={(data) => (
                                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold' }}>
                                    {data.text}
                                </div>
                            )}
                        />

                        <Column
                            dataField="popularity"
                            caption="Popularity"
                            cellRender={(data) => (
                                <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold' }}>
                                    {data.value.toFixed(2)}
                                </div>
                            )}
                        />
                        <Column
                            dataField="vote_average"
                            caption='Ratings'
                            cellRender={(data) => {
                                let ratingsElement = (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                                        <span style={{ marginBottom: '4px' }}>Avg: {data.data.vote_average}</span>
                                        <span>Count: {data.data.vote_count}</span>
                                    </div>
                                );

                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {ratingsElement}
                                    </div>
                                );
                            }}
                        />
                    </DataGrid>
                </Row>
            </div>
        )
    }

    const mobilePage = () => {
        return (<div>
            <Row>
                <Col xs="6">
                    <TextBox
                        value={movieSearchTextboxValue}
                        onValueChanged={(e) => setMovieSearchTextboxValue(e.value)}
                        onEnterKey={(e) => {
                            SearchMovie(1);
                        }}
                        label='Search Movie or Tv Show'
                        labelMode='floating'
                        showClearButton={true}
                    />
                </Col>
                <Col xs="6">
                    <Button
                        text="Search Movie"
                        type="default"
                        width={"100%"}
                        height={"100%"}
                        stylingMode="contained"
                        onClick={() => {
                            SearchMovie(1);
                        }}
                        style={{ color: 'white' }}
                    />
                </Col>
            </Row>
            <br />
            <Row>
                <Col xs="12">
                    <Button
                        text="Discover Movie"
                        type="default"
                        width={"100%"}
                        height={"100%"}
                        stylingMode="contained"
                        onClick={() => {
                            setMovieSearchTextboxValue("");
                            DiscoverMovie(1);
                        }}
                        style={{ color: 'white' }}
                    />
                </Col>
            </Row>
            <br />
            <Row>
                <DataGrid
                    dataSource={searchedMovieDataSource}
                    keyExpr="id"
                    height={window.innerHeight - 200}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    hoverStateEnabled={true}
                    cellHintEnabled={true}
                    showBorders={true}
                    onRowUpdating={onRowUpdating}
                    showColumnHeaders={true}
                    showColumnLines={true}
                    showRowLines={true}
                    scrolling={{
                        mode: "virtual",
                        showScrollbar: "always",
                        columnRenderingMode: "standard"
                    }}
                >
                    <MasterDetail
                        enabled={true}
                        component={renderDetailGrid}
                    />
                    <Column
                        dataField="combined"
                        caption="Details"
                        width={'100%'}
                        cellRender={(data) => {
                            const imageUrl = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.data.poster_path}`;
                            return (
                                <div style={{ display: 'flex', padding: '10px', gap: '10px' }}>
                                    <img src={imageUrl} alt="Poster" style={{ width: '90px', height: '130px', objectFit: 'cover' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <strong>{data.data.title}</strong>
                                        <span>Type: {data.data.type}</span>
                                        <span>Release: {new Date(data.data.release_date).getFullYear()}</span>
                                        <span>Popularity: {data.data.popularity.toFixed(2)}</span>
                                        <span>Ratings: {data.data.vote_average} ({data.data.vote_count})</span>
                                        <span>Adult: {data.data.adult ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>
                            );
                        }}
                    />
                    <Column dataField='poster_path' visible={false} />
                    <Column dataField='title' visible={false} />
                    <Column dataField='release_date' visible={false} />
                    <Column dataField='popularity' visible={false} />
                    <Column dataField='vote_average' visible={false} />
                    <Column dataField='adult' visible={false} />
                </DataGrid>
            </Row>
        </div>)
    }

    return (
        <div>
            {isMobile ? (mobilePage()) : (dekstopPage())}
            <br />
            <Row>
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={pageCountInfo}
                    onPageChange={handlePageClick}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
            </Row>
        </div>
    )
}