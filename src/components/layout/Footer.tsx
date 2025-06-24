const Footer: React.FC = () => {
  return (
    <footer className="h-[5vh] w-full my-10 flex-center italic text-green-800 dark:text-green-700">
      <a
        className="flex-center space-x-4 tracking-tight text-sm font-bold"
        max-lg="text-xs"
        hover="underline underline-offset-5"
        href="https://github.com/RylanBot/melody-workshop"
        target="_blank"
      >
        <div className="i-tdesign:logo-github-filled"></div>
        <p>Open-source Project</p>
      </a>
    </footer>
  );
};

export default Footer;
