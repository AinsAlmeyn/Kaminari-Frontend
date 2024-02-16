import React, { useEffect, useState } from 'react';
import PieChart, {
  Series,
  Legend,
  Label,
  Connector,
} from 'devextreme-react/pie-chart';
import { usePostRequestSyncPromise } from "../../global/GlobalFetch";

const AnimeStatistics = ({ data }) => {
  console.log(data)
  const pieChartData = [
    { category: "Favorites", value: data.favorites },
    { category: "Popularity", value: data.popularity },
    { category: "Rank", value: data.rank },
    { category: "Scored By", value: data.scored_by },
    { category: "Members", value: data.members },
  ];

  const [userStats, setUserStats] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const postRequestSyncPromise = usePostRequestSyncPromise();

  useEffect(() => {
    let malIdInformation = { mal_id: data.mal_id };
    postRequestSyncPromise("Anime/AnimeUserStats", malIdInformation)
      .then(response => {
        setUserStats(response.data.scores);
        setUserStatus({
          watching: response.data.watching,
          completed: response.data.completed,
          on_hold: response.data.on_hold,
          dropped: response.data.dropped,
          plan_to_watch: response.data.plan_to_watch,
          total: response.data.total
        });
      })
      .catch(error => {
        console.error(error);
      });
  }, [data.mal_id, postRequestSyncPromise]);
  
  const customizeLabel = (arg) => {
    return `${arg.argumentText}: ${arg.valueText} (${arg.percentText})`;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '32%' }}>
        <PieChart
          id="pie-chart"
          dataSource={pieChartData}
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
              <Connector visible={true} />
            </Label>
          </Series>
          <Legend
            orientation="horizontal"
            itemTextPosition="right"
            horizontalAlignment="center"
            verticalAlignment="bottom"
          />
        </PieChart>
      </div>

      {userStats && (
        <div style={{ width: '32%' }}>
          <PieChart
            id="user-stats-pie-chart"
            dataSource={userStats.map(stat => ({
              category: `Score: ${stat.score}`,
              value: stat.votes,
            }))}
            palette="Soft Pastel"
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
                <Connector visible={true} />
              </Label>
            </Series>
            <Legend
              orientation="horizontal"
              itemTextPosition="right"
              horizontalAlignment="center"
              verticalAlignment="bottom"
            />
          </PieChart>
        </div>
      )}

      {userStatus && (
        <div style={{ width: '32%' }}>
          <PieChart
            id="user-status-pie-chart"
            dataSource={[
              { category: "Watching", value: userStatus.watching },
              { category: "Completed", value: userStatus.completed },
              { category: "On Hold", value: userStatus.on_hold },
              { category: "Dropped", value: userStatus.dropped },
              { category: "Plan to Watch", value: userStatus.plan_to_watch },
            ]}
            palette="Ocean"
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
                <Connector visible={true} />
              </Label>
            </Series>
            <Legend
              orientation="horizontal"
              itemTextPosition="right"
              horizontalAlignment="center"
              verticalAlignment="bottom"
            />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default AnimeStatistics;
