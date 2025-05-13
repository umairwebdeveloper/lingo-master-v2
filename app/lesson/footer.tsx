import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle } from "lucide-react"
import { useKey, useMedia } from "react-use"

type FooterProps = {
    status: "correct" | "wrong" | "none" | "completed";
    onCheck: () => void; // Functie voor de Check-knop
    onPrevious?: () => void; // Functie voor de Vorige-knop
    disabled?: boolean; // Voor Check-knop
    disablePrevious?: boolean; // Voor Vorige-knop
    lessonId?: number;
};



const Footer = ({
    onCheck,
    onPrevious,
    status,
    disabled,
    lessonId,
    disablePrevious
}: FooterProps) => {

    useKey("Enter", onCheck, {}, [onCheck])

    const isMobile = useMedia("(max-width:1024px)")
    return (
        <footer
            className={cn(
                "lg:-h-[140px] h-[100px] border-t-2 py-4",
                status === "correct" && "border-transparent bg-green-100",
                status === "wrong" && "border-transparent bg-rose-100"
            )}
        >
            <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
                {status === "correct" && (
                    <div className="text-green-500 font-bold text-base lg:text-2xl flex items-center">
                        <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
                        Nicely Done!
                    </div>
                )}
                {status === "wrong" && (
                    <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center">
                        <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
                        Try again.
                    </div>
                )}
                {status === "completed" && (
                    <Button
                        variant={"default"}
                        size={isMobile ? "sm" : "lg"}
                        onClick={() => (window.location.href = `/lesson/${lessonId}`)}
                    >
                        practice again
                    </Button>
                )}
                <Button
                    disabled={disablePrevious} // Disable de Vorige knop als nodig
                    className="mr-2" // Zet knop links van Check
                    onClick={onPrevious} // Callback voor Vorige-knop
                    size={isMobile ? "sm" : "lg"}
                    variant="secondary"
                >
                    Vorige
                </Button>
                <Button
                    disabled={disabled} // Disable Check-knop als nodig
                    onClick={onCheck} // Callback voor Check-knop
                    size={isMobile ? "sm" : "lg"}
                    variant={status === "wrong" ? "danger" : "secondary"}
                >
                    Check
                </Button>
            </div>
        </footer>
    )
    
}

export default Footer