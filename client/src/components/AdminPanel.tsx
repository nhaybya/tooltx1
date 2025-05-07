import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function AdminPanel() {
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState(false);
  const { adminLogin, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  const handleAdminLogin = () => {
    if (adminLogin(adminPassword)) {
      setAdminPassword("");
      setError(false);
      setLocation("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isAdmin ? (
        <Button
          onClick={() => setLocation("/admin")}
          className="rounded-full w-12 h-12 bg-[#1E1E1E] hover:bg-primary text-white flex items-center justify-center shadow-lg"
        >
          <i className="fas fa-user-shield text-lg"></i>
        </Button>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full w-12 h-12 bg-[#1E1E1E] hover:bg-secondary text-white flex items-center justify-center shadow-lg">
              <i className="fas fa-key text-lg"></i>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#242424] border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl text-white mb-2">
                <div className="flex items-center gap-2">
                  <i className="fas fa-user-shield text-primary"></i>
                  <span>Admin Access</span>
                </div>
              </DialogTitle>
              <DialogDescription className="text-light-dimmed">
                Nhập mật khẩu admin để tiếp tục
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setError(false);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAdminLogin();
                    }
                  }}
                  placeholder="Admin password"
                  className={`bg-[#1E1E1E] border-gray-700 py-5 px-4 text-white ${
                    error ? "border-destructive" : ""
                  }`}
                />
                {error && (
                  <div className="text-destructive text-sm mt-1">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    Mật khẩu không chính xác
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <DialogClose asChild>
                  <Button variant="outline" className="bg-[#1E1E1E] text-white border-gray-700">
                    Hủy
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleAdminLogin}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Đăng nhập
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}