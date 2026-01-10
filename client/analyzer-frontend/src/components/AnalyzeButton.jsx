function AnalyzeButton({ resume, jobDesc, setResult }) {
    const handleAnalyze = async () => {
        if (!resume || !jobDesc) {
            alert("Please upload resume and add job description");
            return;
        }

        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("jobDescription", jobDesc);

        try {
            const response = await fetch("http://localhost:5000/api/analyze", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            alert("Error analyzing resume");
        }
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <button onClick={handleAnalyze}>Analyze Resume</button>
        </div>
    );
}

export default AnalyzeButton;
