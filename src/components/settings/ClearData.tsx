

export default function ClearData() {
    function clearData(){
        localStorage.clear()
        window.location.reload();
    }

    return (
        <div className="bg-panel1 outline-1 outline-border rounded-md p-3 flex items-center justify-between">
            <p className="text-sm text-subtext2 font-medium">
                Clear Saved Data
            </p>
            <button className="px-5 w-21 py-1 bg-panel2 outline-red-500 outline-1 rounded-md text-red-500 font-medium hover:cursor-pointer hover:bg-panel3 transition-colors"
                onClick={clearData}>
                Clear
            </button>

        </div>
    )
}
