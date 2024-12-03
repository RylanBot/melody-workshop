import { useNavigate } from "react-router-dom";

interface IntroCardProps {
  path: string;
  icon: string;
  title: string;
  description: string;
}

const IntroCard: React.FC<IntroCardProps> = ({ path, icon, title, description }) => {
  const navigate = useNavigate();
  return (
    <>
      <button
        onClick={() => navigate(path)}
        className="w-96 bg-gray-100 p-4 rounded-lg flex-center font-bold border-3 border-green-600 dark:border-green-500 hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        <div className={`w-16 text-8xl text-gray-600 ${icon}`}></div>
        <div className="text-left ml-4 w-full">
          <h2 className="text-xl mb-2 text-green-700 dark:text-green-600">{title}</h2>
          <p className="leading-tight text-gray-600">{description}</p>
        </div>
      </button>
    </>
  );
};

export default IntroCard;
