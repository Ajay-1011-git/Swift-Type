import { useTypingStore } from "@/backend/store/typingStore";
import TypingOptions from "../../components/TypingOptions/TypingOptions";
import TypingArea from "../../components/TypingArea/TypingArea";
import ResultsPanel from "../../components/ResultsPanel/ResultsPanel";
function Home() {
  const { status } = useTypingStore();
  return <div className="flex-1 flex flex-col items-center justify-center px-4">
      {status === "finished" ? <ResultsPanel /> : <div className="w-full max-w-[850px] flex flex-col items-center gap-8">
          {status === "idle" && <TypingOptions />}
          <TypingArea />
        </div>}
    </div>;
}
export {
  Home as default
};
