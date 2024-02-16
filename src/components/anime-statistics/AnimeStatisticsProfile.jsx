import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PieChart, { Series, Legend, Label, Connector } from 'devextreme-react/pie-chart';
import { usePostRequestSyncPromise } from '../../global/GlobalFetch';

// Adjust the debounce time according to your needs
const fetchUserStatsDebounced = _.debounce((animeId, postRequest, setChartData, setIsLoading, setError) => {
    setIsLoading(true);
    postRequest("Anime/AnimeUserStats", { mal_id: animeId })
        .then(response => {
            const data = response.data;
            // Transform the API response to match the chart data format
            const scoresData = data.scores.map(score => ({
                category: `Score: ${score.score}`,
                value: score.votes,
                percentage: score.percentage
            }));
            const statusData = [
                { category: "Watching", value: data.watching },
                { category: "Completed", value: data.completed },
                { category: "On Hold", value: data.on_hold },
                { category: "Dropped", value: data.dropped },
                { category: "Plan to Watch", value: data.plan_to_watch }
            ];
            setChartData({ scoresData, statusData });
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Fetch error:", error);
            setError(error);
            setIsLoading(false);
        });
}, 0);

const AnimeStatisticsProfile = ({ data: animeId }) => {
    const [chartData, setChartData] = useState({ scoresData: [], statusData: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const postRequestSyncPromise = usePostRequestSyncPromise();

    useEffect(() => {
        if (animeId) {
            fetchUserStatsDebounced(animeId, postRequestSyncPromise, setChartData, setIsLoading, setError);
        }
        // Cleanup function to cancel the debounced call if the component unmounts
        return () => fetchUserStatsDebounced.cancel();
    }, [animeId, postRequestSyncPromise]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.toString()}</p>;
    if (!chartData.scoresData.length && !chartData.statusData.length) return <p>Details not found.</p>;

    const customizeLabel = (arg) => `${arg.argumentText}: ${arg.valueText} (${arg.percentText})`;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '50%' }}>
                <PieChart
                    id="user-scores-pie-chart"
                    dataSource={chartData.scoresData}
                    palette="Bright"
                    sizeGroup="animeStatsGroup"
                    type="doughnut"
                    innerRadius={0.65}
                    resolveLabelOverlapping="shift"
                >
                    <Series argumentField="category" valueField="value">
                        <Label visible={true} format="fixedPoint" customizeText={customizeLabel} backgroundColor="none">
                            <Connector visible={true} />
                        </Label>
                    </Series>
                    <Legend orientation="horizontal" itemTextPosition="right" horizontalAlignment="center" verticalAlignment="bottom" />
                </PieChart>
            </div>

            <div style={{ width: '50%' }}>
                <PieChart
                    id="user-status-pie-chart"
                    dataSource={chartData.statusData}
                    resolveLabelOverlapping="shift"
                    innerRadius={0.65}
                    palette="Ocean"
                    sizeGroup="animeStatsGroup"
                    type="doughnut"
                >
                    <Series argumentField="category" valueField="value">
                        <Label visible={true} format="fixedPoint" customizeText={customizeLabel} backgroundColor="none">
                            <Connector visible={true} />
                        </Label>
                    </Series>
                    <Legend orientation="horizontal" itemTextPosition="right" horizontalAlignment="center" verticalAlignment="bottom" />
                </PieChart>
            </div>
        </div>
    );
};

export default AnimeStatisticsProfile;
