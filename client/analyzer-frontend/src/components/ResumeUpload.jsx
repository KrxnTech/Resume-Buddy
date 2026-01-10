function ResumeUpload({ setResume }) {
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file only");
            return;
        }

        setResume(file);
    };

    return (
        <div>
            <h3>Upload Resume (PDF)</h3>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
        </div>
    );
}

export default ResumeUpload;
