// Reusable stat card component
export const StatCard = ({ title, stats,colorBorder }) => (
    <div className={`p-6 bg-white border-l-8 rounded-lg shadow-md ${colorBorder}  `}>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {stats.map((stat, index) => (
        <p key={index} className="text-gray-600">
          {stat.label}: {stat.value}
        </p>
      ))}
    </div>
  );