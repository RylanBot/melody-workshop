const Footer: React.FC = () => {
  return (
    <footer className="h-[5vh] w-full my-10 flex-center italic text-green-800 dark:text-green-700">
      <a
        href="https://github.com/RylanBot/melody-workshop"
        target="_blank"
        className="flex-center space-x-4 tracking-tight text-sm font-bold"
        hover="underline underline-offset-5"
        max-sm="text-xs"
      >
        <div className="i-tdesign:logo-github-filled"></div>
        <p>Open-source Project</p>
      </a>
    </footer>
  );
};

export default Footer;
