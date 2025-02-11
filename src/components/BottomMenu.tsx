
import { Home, Layout, Upload, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface BottomMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const BottomMenu = ({ isOpen, onClose }: BottomMenuProps) => {
  const navigate = useNavigate();

  const menuItems = [
    { 
      id: 1, 
      label: "Home", 
      icon: Home, 
      action: () => navigate("/") 
    },
    { 
      id: 2, 
      label: "Apps", 
      icon: Layout, 
      action: () => navigate("/apps") 
    },
    { 
      id: 3, 
      label: "Upload", 
      icon: Upload, 
      action: () => navigate("/apps") 
    },
    { 
      id: 4, 
      label: "Profile", 
      icon: UserCircle, 
      action: () => navigate("/profile") 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-1">
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
