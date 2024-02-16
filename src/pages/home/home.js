import React, { useEffect, useState } from 'react';
import { Row, Col } from "reactstrap";
import { Button, TextBox, SelectBox, } from 'devextreme-react';
import ReactPaginate from 'react-paginate';
import '../home/home.css';
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
  Popup
} from "devextreme-react/data-grid";
import { RangeSlider } from 'devextreme-react/range-slider';
import { usePostRequestSyncPromise } from "../../global/GlobalFetch";
import TabPanel, { Item } from 'devextreme-react/tab-panel';
import AnimeDetailTab from '../../components/anime-detail/AnimeDetailTab';
import AnimeSynopsisBackground from '../../components/anime-synopsis-background/AnimeSynopsisBackground';
import AnimeStatistics from '../../components/anime-statistics/AnimeStatistics';
import AnimeTrailer from '../../components/anime-trailer/AnimeTrailer';
import AnimeStaffGrid from '../../components/anime-staff/AnimeStaff';
import AnimeCharacters from '../../components/anime-character/AnimeCharacters';
import AnimePictures from '../../components/anime-pictures/AnimePictures';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.js';

const AnimeDetails = ({ data }) => {
  return (
    <TabPanel>
      <Item icon='fa-solid fa-list-check' title="Anime Detail" component={() => <AnimeDetailTab data={data} />} />
      <Item icon='fa-solid fa-align-left' title="Synopsis & Background" component={() => <AnimeSynopsisBackground data={data} />} />
      <Item icon='fa-solid fa-chart-line' title="Statistics" component={() => <AnimeStatistics data={data} />} />
      <Item icon='fa-solid fa-play' title="Trailer" component={() => <AnimeTrailer data={data} />} />
      <Item icon='fa-solid fa-users' title="Staff" component={() => <AnimeStaffGrid data={data} />} />
      <Item icon='fa-solid fa-microphone' title="Characters & Voice Actors" component={() => <AnimeCharacters data={data} />} />
      <Item icon='fa-solid fa-image' title="Pictures" component={() => <AnimePictures animeId={data.mal_id} />} />
    </TabPanel>
  );
};


const scoreOptions = [
  { id: '0', name: 'No Score', icon: 'far fa-circle' },
  { id: '1', name: '1', icon: 'fas fa-seedling' },
  { id: '2', name: '2', icon: 'fas fa-spa' },
  { id: '3', name: '3', icon: 'fas fa-leaf' },
  { id: '4', name: '4', icon: 'fas fa-apple-alt' },
  { id: '5', name: '5', icon: 'fa-solid fa-fan' },
  { id: '6', name: '6', icon: 'fas fa-tree' },
  { id: '7', name: '7', icon: 'fas fa-mountain' },
  { id: '8', name: '8', icon: 'fas fa-globe-americas' },
  { id: '9', name: '9', icon: 'fas fa-rocket' },
  { id: '10', name: '10', icon: 'fas fa-crown' }
];

const animeTypes = [
  "tv", "movie", "ova", "special", "ona", "music", "cm", "pv", "tv_special"
];
const airingTypes = [
  "airing", "complete", "upcoming"
];
const animeStatuses = [
  { id: 'Completed', name: 'Completed' },
  { id: 'Dropped', name: 'Dropped' },
  { id: 'On-Hold', name: 'On-Hold' },
  { id: 'Plan to Watch', name: 'Plan to Watch' },
  { id: 'Watching', name: 'Watching' }
];

export default function Home() {

  const popupContentStyle = {
    textAlign: 'center',
  };

  const sliderLabelStyle = {
    display: 'block',
    marginTop: '20px',
    fontWeight: 'bold',
  };


  //! ANIME SEARCH TEXTBOX VALUE
  const [animeSearchTextboxValue, setAnimeSearchTextboxValue] = useState('');
  const [animeTypeSelectboxValue, setAnimeTypeSelectboxValue] = useState('');
  const [airingTypeSelectboxValue, setAiringTypeSelectboxValue] = useState('');
  const [rangeValues, setRangeValues] = useState([0, 10]);

  //! SEARCH BY SEASON
  const [yearsAndSeasons, setYearsAndSeasons] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);

  //! FILTER PANEL CONTROL
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(true);

  const [pageCountInfo, setPageCountInfo] = useState(1);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleRangeChange = (e) => {
    console.log(e.value);
    setRangeValues(e.value);
  };
  //! GLOBAL FETCH
  const postRequestSyncPromise = usePostRequestSyncPromise();

  //! SEARCHED ANIME DATA
  const [searchedAnimeDataSource, setSearchedAnimeDataSource] = useState([]);

  //! GRID HEIGHT
  const [gridHeight, setGridHeight] = useState(window.innerHeight);


  //! USE EFFECT
  useEffect(() => {
    const handleResize = () => {
      setGridHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    fetchSeasonNowAnimes();
    // Component unmount olduğunda event listener'ı temizle
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    // Panel açıldığında ve 'yearsAndSeasons' boş olduğunda 'fetchSeasons' fonksiyonunu çağır
    if (!isFilterPanelVisible && yearsAndSeasons.length === 0) {
      fetchSeasons();
    }
  }, [isFilterPanelVisible]);

  //! FETCH ANIME SEARCH REQUEST
  function fetchAnimeSearch(page = 1) {
    const searchFilter = {
      q: animeSearchTextboxValue,
      type: animeTypeSelectboxValue,
      status: airingTypeSelectboxValue,
      min_score: rangeValues[0],
      max_score: rangeValues[1],
      page: page,
      userId: localStorage.getItem("userId")
    };

    postRequestSyncPromise("Anime/SearchAnime", searchFilter)
      .then(data => {
        setSearchedAnimeDataSource(data.data);
        setPageCountInfo(data.pagination.last_visible_page);
      })
      .catch(error => {
        console.error();
      });
  }


  function fetchSeasonNowAnimes(page) {
    let pageInformation = 1;
    if (page === undefined || page === null) {
      pageInformation = {};
    }
    else {
      pageInformation = page;
    }
    pageInformation.userId = localStorage.getItem("userId");
    postRequestSyncPromise("Anime/SeasonNowAnimes", pageInformation)
      .then(data => {
        setSearchedAnimeDataSource(data.data);
        setPageCountInfo(data.pagination.last_visible_page);
      })
      .catch(error => {
        console.error();
      });
  }

  const handleYearChange = (e) => {
    setSelectedYear(e.value);
    setSelectedSeason(null); // Yıl değişince sezonu sıfırla
  };

  const handleSeasonChange = (e) => {
    setSelectedSeason(e.value);
  };


  const handleSearchBySeason = () => {
    postRequestSyncPromise("Anime/SearchSeasons",
      {
        year: selectedYear,
        season: selectedSeason,
        userId: localStorage.getItem("userId")
      })
      .then(data => {
        setSearchedAnimeDataSource(data.data);
        setPageCountInfo(data.pagination.last_visible_page);
      })
      .catch(error => {
        console.error();
      });
  };
  function fetchSeasons() {
    postRequestSyncPromise("Anime/AllSeasons", {})
      .then(data => {
        setYearsAndSeasons(data.data);
      })
      .catch(error => {
        console.error();
      });
  }

  const handlePageClick = (data) => {
    let selectedPage = data.selected + 1;
    setSearchedAnimeDataSource([]);
    if (isSearchActive) {
      fetchAnimeSearch(selectedPage);
    } else {
      fetchSeasonNowAnimes({ page: selectedPage });
    }
  };


  //! FORMAT DATE
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() 0'dan başlar
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const renderDetailGrid = (row) => {
    return <AnimeDetails data={row.data.data} />;
  };

  //! ON GRID INITIALIZED
  const onGridInitialized = (e) => {
    e.component.columnOption('aired.from', 'visibleIndex', -1);
    e.component.columnOption('aired.to', 'visibleIndex', -1);
  };

  //! FILTER PANEL CONTROL
  const toggleFilterPanel = () => {
    setIsFilterPanelVisible(!isFilterPanelVisible);
  };

  //! ON ROW UPDATING EVENT

  async function onRowUpdating(e) {
    console.log(e);
    e.cancel = new Promise(async (resolve) => {
      const userId = localStorage.getItem("userId");

      if (e.newData.my_score == null || e.newData.my_status == null) {
        console.log("my_score veya my_status için geçerli bir değer sağlanmadı. Güncelleme işlemi iptal ediliyor.");
        resolve(true);
        return;
      }

      const postData = {
        series_animedb_id: e.oldData.mal_id,
        series_title: e.oldData.title,
        series_type: e.oldData.type,
        series_episodes: e.oldData.episodes,
        my_score: e.newData.my_score,
        my_status: e.newData.my_status,
        userId: userId,
      };
      console.log(postData);
      await postRequestSyncPromise("UserAnimeProfile/InsertUserAnime", postData)
        .then(data => {
          resolve(false);
        })
        .catch(error => {
          console.error("Güncelleme işlemi sırasında hata oluştu:", error);
          resolve(true);
        });
    });
  }


  return (
    <div>
      {isFilterPanelVisible && (
        <>
          <Row>
            <Col xs="3">
              <TextBox
                value={animeSearchTextboxValue}
                onValueChanged={(e) => setAnimeSearchTextboxValue(e.value)}
                onEnterKey={(e) => {
                  fetchAnimeSearch();
                }}
                label='Search Anime Title...'
                labelMode='floating'
                showClearButton={true}
              />

            </Col>
            <Col xs="3">
              <SelectBox
                items={animeTypes}
                value={animeTypeSelectboxValue}
                onValueChanged={(e) => setAnimeTypeSelectboxValue(e.value)}
                labelMode='floating'
                label='Select Anime Type...'
                showClearButton={true}
              />
            </Col>
            <Col xs="3">
              <SelectBox
                items={airingTypes}
                value={airingTypeSelectboxValue}
                onValueChanged={(e) => setAiringTypeSelectboxValue(e.value)}
                labelMode='floating'
                label='Select Airing Type...'
                showClearButton={true}
              />
            </Col>
            <Col xs="3">
              <RangeSlider
                min={0}
                max={10}
                start={0}
                end={10}
                step={1}
                label={{
                  visible: false,
                  format: 'decimal'
                }}
                value={rangeValues}
                onValueChanged={handleRangeChange}
              />
              <div style={{ paddingLeft: '5%' }}>
                Score Range {rangeValues[0]} - {rangeValues[1]}
              </div>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs="6">
              <Button text="Search Anime" stylingMode='contained' hoverStateEnabled={true} style={{
                backgroundColor: '#009688',
                color: 'white',
              }} width={"100%"} height={"100%"}
                onClick={() => {
                  setIsSearchActive(true);
                  fetchAnimeSearch();
                }}
              />
            </Col>
            <Col xs="6">
              <Button text={isFilterPanelVisible ? "Season Filter Panel" : "Detailed Filter Panel"} stylingMode='contained' hoverStateEnabled={true} style={{
                backgroundColor: '#009688',
                color: 'white',
              }} width={"100%"} height={"100%"}
                onClick={toggleFilterPanel}
              />
            </Col>
          </Row>
        </>
      )}
      {!isFilterPanelVisible && (
        <>
          <Row>
            <Col xs="6">
              <SelectBox
                items={yearsAndSeasons.map(item => item.year)}
                value={selectedYear}
                onValueChanged={handleYearChange}
                labelMode='floating'
                label='Select Year...'
                showClearButton={true}
              />
            </Col>
            <Col xs="6">
              <SelectBox
                items={selectedYear ? yearsAndSeasons.find(item => item.year === selectedYear)?.seasons : []}
                value={selectedSeason}
                onValueChanged={handleSeasonChange}
                labelMode='floating'
                label='Select Season...'
                showClearButton={true}
                disabled={!selectedYear} // Yıl seçilmediyse sezon seçilemez
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs="6">
              <Button text="Search by Season" stylingMode='contained' hoverStateEnabled={true} style={{
                backgroundColor: '#009688',
                color: 'white',
              }} width={"100%"} height={"100%"}
                onClick={handleSearchBySeason}
                disabled={!selectedYear || !selectedSeason} // Yıl ve sezon seçilmediyse buton etkisizdir
              />
            </Col>
            <Col xs="6">
              <Button text={isFilterPanelVisible ? "Season Filter Panel" : "Detailed Filter Panel"} stylingMode='contained' hoverStateEnabled={true} style={{
                backgroundColor: '#009688',
                color: 'white',
              }} width={"100%"} height={"100%"}
                onClick={toggleFilterPanel}
              />
            </Col>
          </Row>
        </>
      )}
      <br />
      <Row>
        <DataGrid
          dataSource={searchedAnimeDataSource}
          keyExpr="mal_id"
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          hoverStateEnabled={true}
          cellHintEnabled={true}
          showBorders={true}
          height={gridHeight - 260}
          scrolling={{
            mode: "virtual",
            showScrollbar: "always",
            columnRenderingMode: "standard"
          }}
          showColumnHeaders={true}
          showColumnLines={true}
          showRowLines={true}
          searchPanel={{
            visible: true,
            placeholder: "Search...",
            highlightSearchText : true,
            width: 240,
            highlightCaseSensitive: true,
            searchVisibleColumnsOnly: false,
          }}
          onInitialized={onGridInitialized}
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
          <Editing
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
                    items: animeStatuses,
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
          </Editing>
          <Column
            dataField="images.jpg.large_image_url"
            caption="Image"
            cellRender={(data) => {
              return (
                <img
                  src={data.value}
                  alt="Anime Resmi"
                  style={{ cursor: 'pointer', width: 100, height: 140 }} // İmlecin tıklandığında olduğunu belirtir
                  onClick={() => window.open(data.value, '_blank')} // Resme tıklandığında yeni sekmede açılacak
                />
              );
            }}
          />
          <Column
            dataField="title"
            visible={true}
            caption='Title'
            cellRender={(data) => {
              let iconClass;
              let statusElement = null;
              let scoreElement = null;

              if (data.data.my_status) {
                switch (data.data.my_status) {
                  case 'Completed':
                    iconClass = 'fa fa-check-circle';
                    break;
                  case 'Watching':
                    iconClass = 'fa fa-eye';
                    break;
                  case 'Plan to Watch':
                    iconClass = 'fa fa-clock';
                    break;
                  case 'Dropped':
                    iconClass = 'fa fa-times-circle';
                    break;
                  case 'On-Hold':
                    iconClass = 'fa fa-pause-circle';
                    break;
                  default:
                    iconClass = 'fa fa-question-circle';
                }
                statusElement = (
                  <div key="status" style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', backgroundColor: 'rgba(0, 150, 136, 0.2)', borderRadius: '15px', marginRight: '8px', color: '#009688', fontSize: '16px' }}>
                    <i className={iconClass} style={{ fontSize: '20px', marginRight: '4px' }}></i>
                    {data.data.my_status}
                  </div>
                );
              }

              if (data.data.my_score || data.data.my_score === 0) {
                scoreElement = (
                  <div key="score" style={{ padding: '6px 12px', backgroundColor: 'rgba(0, 150, 136, 0.2)', borderRadius: '15px', fontSize: '16px', color: '#009688' }}>
                    {data.data.my_score}
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                  <span style={{ marginRight: 'auto' }}>{data.data.title}</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {statusElement}
                    {scoreElement}
                  </div>
                  <Button
                    onClick={() => window.open(data.data.url, '_blank', 'noopener,noreferrer')}
                    icon='info'
                    style={{
                      marginLeft: '3px',
                    }}
                  />
                </div>
              );
            }}
          />
          <Column
            dataField="type"
            visible={true}
            caption='Type'
            headerCellRender={(headerData) => <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{headerData.column.caption}</div>}
            cellRender={(data) => <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.value}</div>}
          />
          <Column
            dataField="episodes"
            visible={true}
            caption='Episodes'
            headerCellRender={(headerData) => <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{headerData.column.caption}</div>}
            cellRender={(data) => <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{data.value}</div>}
          />
          <Column
            dataField="score"
            visible={true}
            caption='Score'
            headerCellRender={(headerData) => <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{headerData.column.caption}</div>}
            cellRender={(data) => {
              const formattedValue = new Intl.NumberFormat().format(data.value);
              return (
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{formattedValue}</div>
              );
            }}
          />
          <Column
            dataField="my_score"
            visible={false}
          />
          <Column
            dataField="my_status"
            visible={false}
          />
          <Column
            dataField="members"
            visible={true}
            caption='Members'
            headerCellRender={(headerData) => <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{headerData.column.caption}</div>}
            cellRender={(data) => {
              const formattedValue = new Intl.NumberFormat().format(data.value);
              return (
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{formattedValue}</div>
              );
            }}
          />
          <Column
            dataField="aired.from"
            visible={false}
            caption='Start Date'
            dataType="date"
            customizeText={({ value }) => formatDate(value)}
            headerCellRender={(headerData) => <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{headerData.column.caption}</div>}
            cellRender={(data) => <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{formatDate(data.value)}</div>}
          />
          <Column
            dataField="aired.to"
            visible={false}
            caption='End Date'
            dataType="date"
            customizeText={({ value }) => formatDate(value)}
            headerCellRender={(headerData) => <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{headerData.column.caption}</div>}
            cellRender={(data) => <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{formatDate(data.value)}</div>}
          />

        </DataGrid>
      </Row>
      <Row>
        <Col xs="12">
          <ReactPaginate
            previousLabel={'back'}
            nextLabel={'next'}
            breakLabel={'...'}
            pageCount={pageCountInfo}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </Col>
      </Row>
    </div >
  )
}