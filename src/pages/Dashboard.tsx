import { IntroCard } from "@/components/layout";

function Dashboard() {
  const intros = [
    {
      path: "processing",
      icon: "i-hugeicons:file-audio",
      title: "Audio Processing",
      description: "cut ranges and adjust filters"
    },
    {
      path: "mixing",
      icon: "i-hugeicons:file-sync",
      title: "Audio Mixing",
      description: "combine multiple tracks into one"
    }
  ];

  return (
    <main className="h-[80vh] flex-center flex-col p-6">
      <div
        className="flex gap-16"
        max-sm="flex-col"
      >
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
    </main>
  );
}

export default Dashboard;
