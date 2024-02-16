import '../anime-synopsis-background/animeSynopsisBackground.css';
const AnimeSynopsisBackground = ({ data }) => {
    const { synopsis, background } = data;

    return (
        <div className="detail-container">
            <div className="detail-header">
                <span className="detail-title">Anime Synopsis & Background</span>
            </div>
            <div className="detail-content">
                <div className="detail-section">
                    <div className="detail-label">Synopsis:</div>
                    <div className="detail-value detail-synopsis">{synopsis}</div>
                </div>
                {background && (
                    <div className="detail-section">
                        <div className="detail-label">Background:</div>
                        <div className="detail-value detail-background">{background}</div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AnimeSynopsisBackground;