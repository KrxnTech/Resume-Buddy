function JobDescription({ jobDesc, setJobDesc }) {
    return (
        <div>
            <h3>Job Description</h3>
            <textarea
                rows="6"
                cols="50"
                placeholder="Paste job description here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
            />
        </div>
    );
}

export default JobDescription;
