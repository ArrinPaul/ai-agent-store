
import { Calendar, GamepadIcon, AppsIcon, MonitorPlay, Search } from "lucide-react";
import { toast } from "sonner";

interface BottomMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 1, label: "Today", icon: Calendar, action: () => toast.info("Today section coming soon!") },
  { id: 2, label: "Games", icon: GamepadIcon, action: () => toast.info("Games section coming soon!") },
  { id: 3, label: "Apps", icon: AppsIcon, action: () => toast.info("Apps section coming soon!") },
  { id: 4, label: "Arcade", icon: MonitorPlay, action: () => toast.info("Arcade section coming soon!") },
  { id: 5, label: "Search", icon: Search, action: () => toast.info("Search section coming soon!") },
];

const BottomMenu = ({ isOpen, onClose }: BottomMenuProps) => {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-5 gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.action();
                onClose();
              }}
              className="flex flex-col items-center justify-center py-3 px-2 hover:bg-accent rounded-lg transition-colors"
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomMenu;
