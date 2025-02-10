
import Navigation from "@/components/Navigation";
import BottomMenu from "@/components/BottomMenu";
import { useState } from "react";

const Profile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="glass-effect rounded-xl p-8">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">User Name</h2>
                  <p className="text-muted-foreground">user@example.com</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 rounded-lg bg-secondary/20">
                  <h3 className="text-lg font-semibold mb-2">My Downloads</h3>
                  <p className="text-3xl font-bold text-primary">0</p>
                </div>
                <div className="p-6 rounded-lg bg-secondary/20">
                  <h3 className="text-lg font-semibold mb-2">My Uploads</h3>
                  <p className="text-3xl font-bold text-primary">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default Profile;
