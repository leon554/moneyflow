

export default function Links() {
    return (
        <div className="bg-panel1 outline-1 outline-border rounded-md p-3 flex items-center justify-between">
            <p className="text-sm text-subtext2 font-medium">
                Source Code
            </p>
            <div>
                <a 
                    href="https://github.com/leon554/MoneyFlow" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center w-21 gap-2 px-4 py-2 bg-panel2 outline-border2 outline-1 text-subtext1 rounded-lg hover:bg-panel3 transition-colors shadow-md"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-4 h-4"
                    >
                        <path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.09 3.29 9.4 7.86 10.94.58.11.79-.25.79-.56v-2.15c-3.2.7-3.87-1.54-3.87-1.54-.53-1.35-1.29-1.71-1.29-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.26 3.39.97.1-.76.41-1.26.75-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.3 1.19-3.12-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.19a11.06 11.06 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.76.12 3.05.74.82 1.18 1.86 1.18 3.12 0 4.43-2.68 5.41-5.24 5.7.42.36.8 1.08.8 2.18v3.23c0 .31.21.68.8.56A10.53 10.53 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                    </svg>
                    <span className="text-sm text-subtext1 font-medium">Here</span>
                </a>
            </div>
        </div>
    )
}
