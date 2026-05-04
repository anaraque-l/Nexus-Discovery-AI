import { useState } from "react";
import { CopilotSidebar } from "@/components/copilot/Sidebar";
import { ChatInterface } from "@/components/copilot/ChatInterface";
import { AboutDialog } from "@/components/copilot/AboutDialog";
import { DeliverablesDialog } from "@/components/copilot/DeliverablesDialog";

const RECENT = [
  { id: "1", title: "Logística Preditiva" },
  { id: "2", title: "App Varejo" },
  { id: "3", title: "Plataforma Omnichannel" },
  { id: "4", title: "Modernização ERP" },
];

const Index = () => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [deliverablesOpen, setDeliverablesOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | undefined>();
  const [chatKey, setChatKey] = useState(0);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <CopilotSidebar
        recentChats={RECENT}
        activeId={activeId}
        onSelectChat={setActiveId}
        onNewChat={() => {
          setActiveId(undefined);
          setChatKey((k) => k + 1);
        }}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenDeliverables={() => setDeliverablesOpen(true)}
      />
      <main className="flex-1 flex flex-col">
        <ChatInterface key={chatKey} />
      </main>

      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      <DeliverablesDialog open={deliverablesOpen} onOpenChange={setDeliverablesOpen} />
    </div>
  );
};

export default Index;
