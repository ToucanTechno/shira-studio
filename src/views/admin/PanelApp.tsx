import React from "react";
import { usePathname } from "next/navigation";
import {AuthProvider} from "../../services/AuthContext";
import './PanelApp.css';
import TopAdminNavbar from "./TopAdminNavbar";

// Note: This component is no longer needed with Next.js file-based routing
// The routing is now handled by the app/control-panel directory structure
// This file is kept for reference but should be removed once migration is complete

const PanelApp = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    return (
        <AuthProvider>
            {!pathname?.startsWith("/control-panel/login") &&
            <TopAdminNavbar/>
            }
            {children}
        </AuthProvider>
)
};

export default PanelApp;
