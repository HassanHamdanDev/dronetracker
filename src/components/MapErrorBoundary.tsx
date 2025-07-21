"use client";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class MapErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Map rendering error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#121212] p-4">
                    <h2 className="text-xl font-bold mb-2">Map Loading Failed</h2>
                    <p className="text-center mb-4">
                        {this.state.error?.message || "Failed to load map. Please check your connection."}
                    </p>
                    <button
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Reload Map
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}