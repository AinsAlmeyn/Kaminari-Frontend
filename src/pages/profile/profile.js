import React, { useState, useRef, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import './profile.scss';
import {
  Column,
  DataGrid,
  MasterDetail,
  GroupPanel,
  ColumnChooser,
  FilterRow,
  HeaderFilter,
  Pager,
  Paging,
  Editing,
  Form,
  Popup
} from "devextreme-react/data-grid";
import { TextBox } from "devextreme-react/text-box";
import Button from "devextreme-react/button";
import User from '../../api/StaticUser';
import { usePostRequestSyncPromise } from '../../global/GlobalFetch';
import { useAuth } from '../../contexts/auth';
import { parseString } from 'xml2js';
import TabPanel, { Item } from 'devextreme-react/tab-panel';
import AnimeDetailProfileTab from '../../components/anime-detail/AnimeDetailProfileTab';
import AnimeSynopsisBackgorundProfile from '../../components/anime-synopsis-background/AnimeSynopsisBackgorundProfile';
import AnimeStatisticsProfile from '../../components/anime-statistics/AnimeStatisticsProfile';
import AnimeTrailerProfile from '../../components/anime-trailer/AnimeTrailerProfile';
import AnimeStaffProfile from '../../components/anime-staff/AnimeStaffProfile';
import AnimeCharactersProfile from '../../components/anime-character/AnimeCharactersProfile';
import AnimePictures from '../../components/anime-pictures/AnimePictures';
import Chart, { ArgumentAxis, ValueAxis, Series, Legend, Export, Connector, Label } from 'devextreme-react/chart';
import PieChart from 'devextreme-react/pie-chart';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.js';

const AnimeDetails = ({ data }) => {
  return (
    <TabPanel>
      <Item icon='fa-solid fa-list-check' title="Anime Detail" component={() => <AnimeDetailProfileTab data={data} />} />
      <Item icon='fa-solid fa-align-left' title="Synopsis & Background" component={() => <AnimeSynopsisBackgorundProfile data={data} />} />
      <Item icon='fa-solid fa-chart-line' title="Statistics" component={() => <AnimeStatisticsProfile data={data} />} />
      <Item icon='fa-solid fa-play' title="Trailer" component={() => <AnimeTrailerProfile data={data} />} />
      <Item icon='fa-solid fa-users' title="Staff" component={() => <AnimeStaffProfile data={data} />} />
      <Item icon='fa-solid fa-microphone' title="Characters & Voice Actors" component={() => <AnimeCharactersProfile data={data} />} />
      <Item icon='fa-solid fa-image' title="Pictures" component={() => <AnimePictures animeId={data} />} />
    </TabPanel>
  );
};

//! SUTUN
const UserAnimeColonChart = ({ userData }) => {
  const data = [
    { category: 'Total Anime', value: userData.user_total_anime },
    { category: 'Watching', value: userData.user_total_watching },
    { category: 'Completed', value: userData.user_total_completed },
    { category: 'On Hold', value: userData.user_total_onhold },
    { category: 'Dropped', value: userData.user_total_dropped },
    { category: 'Plan to Watch', value: userData.user_total_plantowatch }
  ];

  return (
    <div className={"content-block dx-card responsive-paddings"}>
      <Chart
        dataSource={data}
        title=""
      >
        <ArgumentAxis tickInterval={1} />
        <ValueAxis />

        <Series
          type="bar"
          argumentField="category"
          valueField="value"
        />

        <Legend visible={false} />
        <Export enabled={true} />
      </Chart>
    </div>
  );
};

//! PIE CHART
const UserAnimePieChart = ({ userData }) => {
  const chartData = [
    { category: 'Watching', value: userData.user_total_watching },
    { category: 'Completed', value: userData.user_total_completed },
    { category: 'On Hold', value: userData.user_total_onhold },
    { category: 'Dropped', value: userData.user_total_dropped },
    { category: 'Plan to Watch', value: userData.user_total_plantowatch }
  ];

  const customizeLabel = (e) => `${e.argumentText}: ${e.valueText}`;

  return (
    <div className="content-block dx-card responsive-paddings">
      <PieChart
        id="pie-chart"
        dataSource={chartData}
        palette="Bright"
        resolveLabelOverlapping="shift"
        sizeGroup="piesGroup"
        innerRadius={0.65}
        type="doughnut"
      >
        <Series
          argumentField="category"
          valueField="value"
        >
          <Label visible={true}
            format="fixedPoint"
            customizeText={customizeLabel}
            backgroundColor="none">
            <Connector visible={true}></Connector>
          </Label>
        </Series>
      </PieChart>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Total Anime: {userData.user_total_anime}</span>
      </div>
    </div>
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

const animeStatuses = [
  { id: 'Completed', name: 'Completed' },
  { id: 'Dropped', name: 'Dropped' },
  { id: 'On-Hold', name: 'On-Hold' },
  { id: 'Plan to Watch', name: 'Plan to Watch' },
  { id: 'Watching', name: 'Watching' }
];
export default function Profile() {

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const userData = User.getUserData();
  const postRequestSyncPromise = usePostRequestSyncPromise();
  const { updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [animeList, setAnimeList] = useState([]);
  const [userAnimeDetail, setUserAnimeDetail] = useState([]);
  const [isAnimeListVisible, setIsAnimeListVisible] = useState(true);

  //! ANIME INSERT POPUP
  // Popup görünürlüğü için state
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // Seçili anime durumu için state
  const [selectedStatus, setSelectedStatus] = useState('');
  // Seçili puan için state
  const [selectedScore, setSelectedScore] = useState(5);
  // Seçili anime için state (popup içinde kullanmak üzere)
  const [selectedAnime, setSelectedAnime] = useState({});

  const showPopup = (data) => {
    setSelectedAnime(data);
    setIsPopupVisible(true);
  };

  const popupContentStyle = {
    textAlign: 'center',
  };

  const sliderLabelStyle = {
    display: 'block',
    marginTop: '20px',
    fontWeight: 'bold',
  };

  const handleSubmit = () => {
    const userId = localStorage.getItem("userId");
    const postData = {
      series_animedb_id: selectedAnime.series_animedb_id,
      series_title: selectedAnime.series_title,
      series_type: selectedAnime.series_type,
      series_episodes: selectedAnime.series_episodes,
      my_score: selectedScore,
      my_status: selectedStatus,
      userId: userId,
    };

    postRequestSyncPromise("UserAnimeProfile/InsertUserAnime", postData)
      .then(data => {
        fetchAnimeList();
      })
      .catch(error => {
        console.error();
      });

    setIsPopupVisible(false);
  };

  const handleDeleteSubmit = () => {
    const userId = localStorage.getItem("userId");
    const postData = {
      series_animedb_id: selectedAnime.series_animedb_id,
      userId: userId,
    };

    postRequestSyncPromise("UserAnimeProfile/DeleteUserAnime", postData)
      .then(data => {
        fetchAnimeList();
      })
      .catch(error => {
        console.error();
      });

    setIsPopupVisible(false);
  }


  const toggleView = () => {
    setIsAnimeListVisible(!isAnimeListVisible);
  };

  function handleChangePassword() {
    let passwordInfo = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      userName: userData.userName
    };
    postRequestSyncPromise("Auth/ChangePassword", passwordInfo)
      .then(data => {
        if (data.type === 0) {
          alert("Password changed successfully");
          setNewPassword('');
          setCurrentPassword('');
        }
        else {
          alert(data.definitionLang);
        }
      })
      .catch(error => {
        console.error();
      });
  }

  function handleChangeUserName() {
    // API çağrısı ve diğer işlemler
    let userNameInfo = {
      userId: userData.userId,
      newUserName: newUserName
    };
    postRequestSyncPromise("Auth/ChangeUserName", userNameInfo)
      .then(data => {
        if (data.type === 0) {
          alert("User Name changed successfully");
          let userProfile = JSON.parse(localStorage.getItem("userData"));
          userProfile.userName = newUserName;

          localStorage.setItem("userData", JSON.stringify(userProfile));
          localStorage.setItem("userCode", newUserName);

          setNewPassword('');
          setCurrentPassword('');
          setNewUserName('');
          updateUser({ email: newUserName });
        } else {
          alert(data.definitionLang);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        parseString(e.target.result, { explicitArray: false }, (err, result) => {
          if (err) {
            alert('Error parsing XML');
            console.error(err);
          } else {
            alert('XML converted to JSON');
            sendDataToServer(result.myanimelist); // Adjusted to directly access myanimelist property
          }
        });
      };
      reader.readAsText(file);
    }
  };

  const sendDataToServer = (myAnimeListData) => {
    const formattedData = {
      myanimelist: myAnimeListData,
      username: userData.userName,
      userId: userData.userId,
    };
    postRequestSyncPromise("UserAnimeProfile/FetchMyAnimeList", formattedData)
      .then(data => {
        if (data.type === 0) {
          alert("Anime list successfully uploaded");
        } else {
          alert("Failed to upload anime list: " + data.definitionLang);
        }
      })
      .catch(error => {
        console.error("Error uploading anime list:", error);
        alert("Error uploading anime list");
      });
  };

  const openFileSelector = () => {
    fileInputRef.current.click();
  };
  const fetchAnimeList = () => {
    const userId = { userId: userData.userId }; // This should be dynamic based on actual user data
    postRequestSyncPromise("UserAnimeProfile/MyAllAnimes", userId)
      .then(response => {
        if (response.type === 0) {
          setUserAnimeDetail(response.data[0].myanimelist.myinfo);
          setAnimeList(response.data[0].myanimelist.anime);
        } else {
          console.error("Failed to fetch anime list:", response.definitionLang);
        }
      })
      .catch(error => {
        console.error("Error fetching anime list:", error);
      });
  };
  useEffect(() => {
    fetchAnimeList();
  }, []);

  const renderDetailTemplate = (row) => {
    const animeId = row.data.data.series_animedb_id;
    return <AnimeDetails data={animeId} />;
  };

  async function onRowUpdating(e) {
    e.cancel = new Promise(async (resolve) => {

      if (e.newData.my_score == null || e.newData.my_status == null) {
        console.log("my_score veya my_status için geçerli bir değer sağlanmadı. Güncelleme işlemi iptal ediliyor.");
        resolve(true);
        return;
      }

      const userId = localStorage.getItem("userId");
      const postData = {
        series_animedb_id: e.oldData.series_animedb_id,
        series_title: e.oldData.series_title,
        series_type: e.oldData.series_type,
        series_episodes: e.oldData.series_episodes,
        my_score: e.newData.my_score,
        my_status: e.newData.my_status,
        my_old_status: e.oldData.my_status,
        userId: userId,
      };

      postRequestSyncPromise("UserAnimeProfile/InsertUserAnime", postData)
        .then(data => {
          resolve(false);
        })
        .catch(error => {
          resolve(true);
        });
    });
  };

  async function onRowRemoving(e) {
    e.cancel = new Promise(async (resolve) => {
      const userId = localStorage.getItem("userId");
      const postData = {
        series_animedb_id: e.data.series_animedb_id,
        userId: userId,
        my_status: e.data.my_status
      };
      postRequestSyncPromise("UserAnimeProfile/DeleteUserAnime", postData)
        .then(data => {
          resolve(false);
        })
        .catch(error => {
          resolve(true);
        });
    });
  }

  return (
    <React.Fragment>
      <br />
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Button
            onClick={toggleView}
            text={isAnimeListVisible ? "Show User Actions" : "Show Anime List"}
            stylingMode="contained"
            style={{
              backgroundColor: '#009688'
              , color: 'white', width: '100%'
            }}
          />
        </Col>
      </Row>
      {isAnimeListVisible ? (
        <div>
          <div className={"content-block dx-card responsive-paddings"}>
            <Row className="justify-content-center">
              <Col xs={12}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{userData.userName}'s Ani List</h2>
              </Col>
            </Row>
            <Row>
              <DataGrid
                dataSource={animeList}
                keyExpr="series_animedb_id"
                allowColumnReordering={true}
                allowColumnResizing={true}
                columnAutoWidth={true}
                wordWrapEnabled={true}
                hoverStateEnabled={true}
                cellHintEnabled={true}
                showBorders={true}
                height={"100%"}
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
                  highlightSearchText : true,
                  width: 240,
                  highlightCaseSensitive: true,
                  searchVisibleColumnsOnly: false,
                }}
                onRowUpdating={onRowUpdating}
                onRowRemoving={onRowRemoving}
              >
                <Editing
                  mode={'popup'}
                  allowUpdating={true}
                  allowDeleting={true}
                  usePopup={true}
                >
                  <Popup
                    title="Anime Update"
                    showTitle={true}
                    width='25%'
                    height='20%'
                  />
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
                        labelMode = {"floating"}
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
                <Pager
                  showPageSizeSelector={true}
                  allowedPageSizes={[5, 10, 20, 50, 70, 100]}
                  showInfo={true}
                  showNavigationButtons={true}
                />
                <Paging enabled={true} defaultPageSize={5} />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <GroupPanel visible={true} />
                <ColumnChooser enabled={true} />

                <MasterDetail
                  enabled={true}
                  component={renderDetailTemplate}
                />
                <Column
                  dataField="series_title"
                  caption="Title"
                  cellRender={({ value }) => <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{value}</span>}
                />
                <Column
                  dataField="series_type"
                  caption="Type"
                  cellRender={({ value }) => <span style={{ textTransform: 'capitalize', fontSize: '18px' }}>{value}</span>}
                />
                <Column
                  dataField="series_episodes"
                  caption="Episodes"
                  cellRender={({ value }) => <span style={{ fontSize: '18px' }}>{value ? value : 'N/A'}</span>}
                />
                <Column
                  dataField="my_score"
                  caption="My Score"
                  cellRender={({ value }) => (
                    <span style={{ fontSize: '18px' }}>{value > 0 ? value : 'No Score'}</span>
                  )}
                />
                <Column
                  dataField="my_status"
                  caption="Status"
                  cellRender={({ value }) => {
                    let iconClass = '';

                    switch (value) {
                      case 'Completed':
                        iconClass = 'fa-check-circle';
                        break;
                      case 'Watching':
                        iconClass = 'fa-eye';
                        break;
                      case 'Plan to Watch':
                        iconClass = 'fa-clock';
                        break;
                      case 'Dropped':
                        iconClass = 'fa-times-circle';
                        break;
                      case 'On-Hold':
                        iconClass = 'fa-pause-circle';
                        break;
                      default:
                        iconClass = 'fa-question-circle';
                    }

                    return (
                      <div style={{ display: 'flex', alignItems: 'center', textTransform: 'capitalize' }}>
                        <i className={`fas ${iconClass}`} style={{
                          marginRight: '8px', fontSize: '30px',
                          color: '#009688'
                        }}></i>
                        {value}
                      </div>
                    );
                  }}
                />
              </DataGrid>
            </Row>
          </div>
          <br />
          <div className={"content-block dx-card responsive-paddings"}>
            <Row className="justify-content-center">
              <Col xs={12}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{userData.userName}'s User Detail</h2>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={6}>
                <UserAnimePieChart userData={userAnimeDetail} />
              </Col>
              <Col md={6}>
                <UserAnimeColonChart userData={userAnimeDetail} />
              </Col>
              {/* <Col md={4}>
                <UserAnimeBarGaugeChart userData={userAnimeDetail} />
              </Col> */}
            </Row>
          </div>
        </div>
      ) : (
        <div>
          <div className={"content-block dx-card responsive-paddings"}>
            <h2>Change Password</h2>
            <div className="row">
              <div className="col-6">
                <TextBox
                  label='Current Password'
                  labelMode='floating'
                  mode="password"
                  value={currentPassword}
                  onValueChanged={e => setCurrentPassword(e.value)}
                />
              </div>
              <div className="col-6">
                <TextBox
                  label='New Password'
                  labelMode='floating'
                  mode="password"
                  value={newPassword}
                  onValueChanged={e => setNewPassword(e.value)}
                />
              </div>
            </div>
            <br></br>
            <Button
              onClick={handleChangePassword}
              text="Update Password"
              type="success"
              stylingMode="contained"
              width="100%"
              style={{ backgroundColor: '#009688', color: 'white' }}
            />
          </div>
          <div className={"content-block dx-card responsive-paddings"}>
            <h2>Change User Name</h2>
            <div className="row">
              <div className="col-6">
                <TextBox
                  label="New User Name"
                  labelMode="floating"
                  mode="text"
                  value={newUserName}
                  onValueChanged={e => setNewUserName(e.value)}
                />
              </div>
              <div className="col-6">
                <Button
                  onClick={handleChangeUserName}
                  text="Update User Name "
                  type="success"
                  stylingMode="contained"
                  width="100%"
                  height={"100%"}
                  style={{ backgroundColor: '#009688', color: 'white' }}
                />
              </div>
            </div>
          </div>
          <br></br>
          <div className={"content-block dx-card responsive-paddings"}>
            <h2>Get Your MAL Animes</h2>
            <input
              type="file"
              style={{ display: 'none' }} // input'u gizle
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xml"
            />
            <Button
              text="Fetch My Animes"
              type="success"
              stylingMode="contained"
              width="100%"
              onClick={openFileSelector}
              style={{ backgroundColor: '#009688', color: 'white' }}
            />
          </div>
        </div>
      )}
    </React.Fragment>
  );
}