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
      <div
        onClick={() => navigate(path)}
        className="cursor-pointer w-115 h-45 space-x-10 bg-gray-100 dark:bg-dark-600 py-4 rounded-lg flex-center font-bold border-3 border-green-600 hover:scale-105 transition-transform duration-300 ease-in-out"
        max-sm="w-84 px-4 space-x-5"
      >
        <div className={`text-7xl text-stone-800 dark:text-stone-300 ${icon}`}></div>
        <div className="w-56 text-left ml-4 text-right">
          <h2 className="text-2xl mb-2 text-green-900 dark:text-green-500">{title}</h2>
          <p className="text-xl leading-tight text-stone-700 dark:text-stone-200">{description}</p>
        </div>
      </div>
    </>
  );
};

export default IntroCard;
