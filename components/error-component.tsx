// _components/ErrorComponent.tsx
import { XCircle } from "lucide-react";

interface ErrorComponentProps {
    message: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message }) => {
    return (
        <div className="flex justify-center items-center my-5">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-lg flex items-center max-w-md mx-auto">
                <XCircle className="w-8 h-8 mr-3" />
                <div>
                    <h2 className="text-xl font-semibold">
                        Something went wrong
                    </h2>
                    <p className="mt-1 text-base">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default ErrorComponent;
