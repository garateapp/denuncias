export default function TabButton({ active, onClick, children }) {
    const baseClasses = 'px-4 py-2 text-sm font-medium rounded-md focus:outline-none';
    const activeClasses = 'bg-indigo-600 text-white';
    const inactiveClasses = 'text-gray-600 bg-gray-200 hover:bg-gray-300';

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
        >
            {children}
        </button>
    );
}
