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
        className="cursor-pointer flex-between w-110 h-45 bg-gray-100 dark:bg-dark-600 px-10 py-4 space-x-20 rounded-lg font-bold border-3 border-green-600 hover:scale-105 transition-transform duration-300 ease-in-out"
        max-lg="w-85 px-4 space-x-10"
      >
        <div className="flex-center">
          <div
            className={`${icon} text-6xl text-stone-800 dark:text-stone-300`}
            max-lg="text-5xl"
          ></div>
        </div>
        <div className="relative text-right">
          <h2 className="absolute right-0 text-2xl text-green-900 dark:text-green-500 whitespace-nowrap">{title}</h2>
          <p className="text-xl leading-tight text-stone-700 dark:text-stone-200 mt-10">{description}</p>
        </div>
      </div>
    </>
  );
};

export default IntroCard;
