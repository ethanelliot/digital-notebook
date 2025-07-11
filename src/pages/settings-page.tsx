import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Unplug, UserCircle } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const tabs = [
  {
    label: "profile",
    title: "Profile",
    description: "Update your personal information and avatar here.",
    icon: UserCircle,
  },
  {
    label: "general",
    title: "General",
    description: "Manage your general account and application settings.",
    icon: Settings,
  },
  {
    label: "integrations",
    title: "Integrations",
    description: "Connect and manage your integrations here.",
    icon: Unplug,
  },
];

const SettingsPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  if (!tab || !tabs.map((tab) => tab.label).includes(tab)) {
    return <Navigate to="/settings/profile" replace />;
  }

  const selectedTab = tabs.find((item) => item.label === tab);

  return (
    <div className="container mx-auto">
      <p className="text-3xl font-bold mb-4">Settings</p>
      <div className="flex justify-between mb-4">
        <Tabs
          value={tab || "profile"}
          onValueChange={(value) => navigate(`/settings/${value}`)}
        >
          <TabsList className="mx-">
            {tabs.map((tab) => (
              <TabsTrigger className="px-4" value={tab.label}>
                <tab.icon />
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{selectedTab?.title}</CardTitle>
          <CardDescription>{selectedTab?.description}</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
