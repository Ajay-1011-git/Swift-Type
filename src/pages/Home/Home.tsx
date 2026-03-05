import TypingOptions from '../../components/TypingOptions/TypingOptions';
import TypingArea from '../../components/TypingArea/TypingArea';
import ResultsPanel from '../../components/ResultsPanel/ResultsPanel';
import { useTypingStore } from '../../store/typingStore';

export default function Home() {
    const { status } = useTypingStore();

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            {status !== 'finished' ? (
                <>
                    <div className="mb-8 w-full max-w-4xl">
                        <TypingOptions />
                    </div>
                    <TypingArea />
                </>
            ) : (
                <ResultsPanel />
            )}
        </div>
    );
}
