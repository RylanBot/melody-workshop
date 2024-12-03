import IntroCard from "@/components/layout/IntroCard";

function Dashboard() {
  const intros = [
    {
      path: "processing",
      icon: "i-hugeicons:file-sync",
      title: "Audio Processing",
      description: "format conversion, speed adjustment and range clipping"
    },
    {
      path: "composition",
      icon: "i-hugeicons:file-audio",
      title: "Audio Composition",
      description: "mix and join multiple tracks into one file"
    }
  ];

  return (
    <div className="h-screen flex-center flex-col p-6">
      <div className="flex gap-10">
        {intros.map((intro, key) => (
          <IntroCard
            key={key}
            path={intro.path}
            icon={intro.icon}
            title={intro.title}
            description={intro.description}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
