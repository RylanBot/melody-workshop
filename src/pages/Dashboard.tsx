import IntroCard from "@/components/layout/IntroCard";

function Dashboard() {
  const intros = [
    {
      path: "processing",
      icon: "i-hugeicons:file-audio",
      title: "Audio Processing",
      description: "cutting ranges and adjusting filters"
    },
    {
      path: "mixing",
      icon: "i-hugeicons:file-sync",
      title: "Audio Mixing",
      description: "combining multiple tracks into a single file"
    }
  ];

  return (
    <div className="h-screen flex-center flex-col p-6">
      <div className="flex gap-16">
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
