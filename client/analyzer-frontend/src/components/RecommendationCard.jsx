import PriorityBadge from "./PriorityBadge";

function RecommendationCard({ recommendation }) {
  return (
    <article className="recommendation-card">
      <div className="recommendation-top">
        <div>
          <h4>{recommendation.title}</h4>
          <p>{recommendation.detail}</p>
        </div>
        <PriorityBadge priority={recommendation.priority} />
      </div>
      <div className="recommendation-meta">
        <span>Impact {recommendation.impact}</span>
        <span>Difficulty {recommendation.difficulty}</span>
      </div>
    </article>
  );
}

export default RecommendationCard;
